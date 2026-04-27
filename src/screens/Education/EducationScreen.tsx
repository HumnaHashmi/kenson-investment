import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Modal, StatusBar, Dimensions, ActivityIndicator, TextInput,
  PanResponder, Animated,
} from 'react-native';
import Video, { VideoRef, OnLoadData, OnProgressData } from 'react-native-video';
import Ionicons from '@react-native-vector-icons/ionicons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScreenHeader } from '../../components/common/ScreenHeader';
import { Skeleton } from '../../components/common/Skeleton';
import { colors, fontSizes, spacing } from '../../theme';
import {
  searchPexelsVideos,
  pickVideoUrl,
  type PexelsVideo,
} from '../../services/pexels.service';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Folder definitions ───────────────────────────────────────────────────────

interface Folder {
  id: string;
  title: string;
  searchQuery: string;   // sent to Pexels API
  color: string;
  emoji: string;
}

const FOLDERS: Folder[] = [
  { id: '1', title: 'Investment Basics',    searchQuery: 'investment finance',    color: colors.primary,  emoji: '📈' },
  { id: '2', title: 'Portfolio Management', searchQuery: 'stock market portfolio', color: '#6B3FA0',       emoji: '💼' },
  { id: '3', title: 'Risk Management',      searchQuery: 'business risk strategy', color: colors.success,  emoji: '🛡️' },
  { id: '4', title: 'Advanced Strategies',  searchQuery: 'trading strategy',       color: colors.accent,   emoji: '🚀' },
  { id: '5', title: 'Market Analysis',      searchQuery: 'financial market chart', color: colors.error,    emoji: '📊' },
  { id: '6', title: 'Tax & Compliance',     searchQuery: 'tax accounting finance', color: '#0097A7',       emoji: '📋' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDuration(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const EducationScreenSkeleton: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <View style={skStyles.header}>
      <View style={{ gap: 5 }}>
        <Skeleton width={100} height={18} borderRadius={6} style={skStyles.skLight} />
        <Skeleton width={150} height={11} borderRadius={4} style={skStyles.skLight} />
      </View>
    </View>
    <View style={skStyles.grid}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <View key={i} style={[styles.folderCard, { borderTopColor: colors.border, width: '47%' }]}>
          <Skeleton width={48} height={48} borderRadius={12} style={{ marginBottom: spacing.sm }} />
          <Skeleton width="80%" height={13} borderRadius={5} style={{ marginBottom: 6 }} />
          <Skeleton width="50%" height={10} borderRadius={4} />
        </View>
      ))}
    </View>
  </SafeAreaView>
);

const skStyles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.base,
    paddingTop: spacing.lg,
    paddingBottom: spacing.base,
  },
  skLight: { backgroundColor: 'rgba(255,255,255,0.25)' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: spacing.base, gap: spacing.sm },
});

const VideoListSkeleton: React.FC = () => (
  <View style={{ padding: spacing.base, gap: spacing.sm }}>
    {[0, 1, 2, 3, 4].map(i => (
      <View key={i} style={[styles.videoItem, { gap: spacing.md }]}>
        <Skeleton width={80} height={56} borderRadius={10} />
        <View style={{ flex: 1, gap: 6 }}>
          <Skeleton width="70%" height={13} borderRadius={5} />
          <Skeleton width="40%" height={10} borderRadius={4} />
        </View>
      </View>
    ))}
  </View>
);

// ─── YouTube-style Video Player Modal ────────────────────────────────────────

interface PlayerProps {
  video: PexelsVideo;
  title: string;
  accentColor: string;
  allVideos: PexelsVideo[];
  currentIndex: number;
  folderTitle: string;
  onClose: () => void;
  onSelectVideo: (video: PexelsVideo, index: number) => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;
const PLAYER_H      = SCREEN_WIDTH * 9 / 16;

const VideoPlayerModal: React.FC<PlayerProps> = ({
  video, title, accentColor, allVideos, currentIndex, folderTitle, onClose, onSelectVideo,
}) => {
  const videoRef               = useRef<VideoRef>(null);
  const hideTimer              = useRef<ReturnType<typeof setTimeout> | null>(null);
  const seekBarRef             = useRef<View>(null);
  const controlsOpacity        = useRef(new Animated.Value(1)).current;

  const [paused,      setPaused]      = useState(false);
  const [buffering,   setBuf]         = useState(true);
  const [error,       setError]       = useState(false);
  const [ended,       setEnded]       = useState(false);
  const [duration,    setDur]         = useState(0);
  const [current,     setCur]         = useState(0);
  const [fullscreen,  setFullscreen]  = useState(false);
  const [seeking,     setSeeking]     = useState(false);
  const [controlsVis, setControlsVis] = useState(true);

  const videoUrl = pickVideoUrl(video);
  const progress = duration > 0 ? current / duration : 0;

  // Auto-hide controls after 3 s
  const scheduleHide = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    hideTimer.current = setTimeout(() => {
      if (!paused) {
        Animated.timing(controlsOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start(
          () => setControlsVis(false),
        );
      }
    }, 3000);
  }, [paused, controlsOpacity]);

  const showControls = useCallback(() => {
    setControlsVis(true);
    Animated.timing(controlsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    scheduleHide();
  }, [controlsOpacity, scheduleHide]);

  useEffect(() => { scheduleHide(); }, [scheduleHide]);
  useEffect(() => () => { if (hideTimer.current) clearTimeout(hideTimer.current); }, []);

  // Pause → always show controls
  useEffect(() => {
    if (paused) {
      if (hideTimer.current) clearTimeout(hideTimer.current);
      setControlsVis(true);
      Animated.timing(controlsOpacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    } else {
      scheduleHide();
    }
  }, [paused, controlsOpacity, scheduleHide]);

  const onLoad = useCallback((d: OnLoadData) => {
    setDur(d.duration);
    setBuf(false);
  }, []);

  const onProgress = useCallback((d: OnProgressData) => {
    if (!seeking) setCur(d.currentTime);
  }, [seeking]);

  const seek = useCallback((secs: number) => {
    const clamped = Math.max(0, Math.min(secs, duration));
    videoRef.current?.seek(clamped);
    setCur(clamped);
    showControls();
  }, [duration, showControls]);

  const skipBack    = () => seek(current - 10);
  const skipForward = () => seek(current + 10);
  const replay      = () => { setEnded(false); setPaused(false); seek(0); };

  // Seek bar pan responder
  const seekPan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        setSeeking(true);
        // immediate seek on touch
        seekBarRef.current?.measure((_x, _y, width, _h, pageX) => {
          const ratio = Math.max(0, Math.min(1, (e.nativeEvent.pageX - pageX) / width));
          setCur(ratio * duration);
        });
      },
      onPanResponderMove: (e) => {
        seekBarRef.current?.measure((_x, _y, width, _h, pageX) => {
          const ratio = Math.max(0, Math.min(1, (e.nativeEvent.pageX - pageX) / width));
          setCur(ratio * duration);
        });
      },
      onPanResponderRelease: (e) => {
        seekBarRef.current?.measure((_x, _y, width, _h, pageX) => {
          const ratio = Math.max(0, Math.min(1, (e.nativeEvent.pageX - pageX) / width));
          const newTime = ratio * duration;
          videoRef.current?.seek(newTime);
          setCur(newTime);
          setSeeking(false);
        });
      },
    }),
  ).current;

  const playerStyle = fullscreen
    ? { width: SCREEN_HEIGHT, height: SCREEN_WIDTH, transform: [{ rotate: '90deg' }] }
    : { width: SCREEN_WIDTH, height: PLAYER_H };

  return (
    <Modal visible animationType="slide" statusBarTranslucent onRequestClose={onClose}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={ytStyles.root}>

        {/* ════ VIDEO PLAYER ════ */}
        <View style={[ytStyles.playerBox, playerStyle]}>
          {!error && (
            <Video
              ref={videoRef}
              source={{ uri: videoUrl }}
              style={StyleSheet.absoluteFill}
              resizeMode="contain"
              paused={paused}
              controls={false}
              repeat={false}
              onLoad={onLoad}
              onProgress={onProgress}
              onEnd={() => { setEnded(true); setPaused(true); }}
              onBuffer={({ isBuffering }) => setBuf(isBuffering)}
              onError={() => { setBuf(false); setError(true); }}
            />
          )}

          {/* buffering spinner */}
          {buffering && !error && (
            <View style={ytStyles.centerOverlay} pointerEvents="none">
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          {/* error */}
          {error && (
            <View style={ytStyles.centerOverlay}>
              <Ionicons name="alert-circle-outline" size={50} color="#fff" />
              <Text style={ytStyles.errorTxt}>Could not load video</Text>
            </View>
          )}

          {/* tap area → toggle controls */}
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={controlsVis ? scheduleHide : showControls}
          />

          {/* ── YouTube-style controls overlay ── */}
          {controlsVis && !error && (
            <Animated.View style={[ytStyles.controlsOverlay, { opacity: controlsOpacity }]}>

              {/* top bar: back + title */}
              <View style={ytStyles.topBar}>
                <TouchableOpacity onPress={onClose} hitSlop={10}>
                  <Ionicons name="chevron-down" size={26} color="#fff" />
                </TouchableOpacity>
                <Text style={ytStyles.topTitle} numberOfLines={1}>{title}</Text>
                <TouchableOpacity onPress={() => { setFullscreen(f => !f); showControls(); }} hitSlop={10}>
                  <Ionicons name={fullscreen ? 'contract' : 'expand'} size={22} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* centre row: -10 / play-pause / +10 */}
              <View style={ytStyles.centreRow}>
                <TouchableOpacity style={ytStyles.skipBtn} onPress={skipBack} hitSlop={10}>
                  <Ionicons name="play-back" size={28} color="#fff" />
                  <Text style={ytStyles.skipLabel}>10</Text>
                </TouchableOpacity>

                {ended ? (
                  <TouchableOpacity style={ytStyles.playCircle} onPress={replay}>
                    <Ionicons name="refresh" size={36} color="#fff" />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={ytStyles.playCircle}
                    onPress={() => { setPaused(p => !p); showControls(); }}>
                    <Ionicons name={paused ? 'play' : 'pause'} size={36} color="#fff" />
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={ytStyles.skipBtn} onPress={skipForward} hitSlop={10}>
                  <Ionicons name="play-forward" size={28} color="#fff" />
                  <Text style={ytStyles.skipLabel}>10</Text>
                </TouchableOpacity>
              </View>

              {/* bottom bar: time + seek bar + duration */}
              <View style={ytStyles.bottomBar}>
                <Text style={ytStyles.timeText}>{fmtDuration(current)}</Text>

                {/* seek bar */}
                <View
                  ref={seekBarRef}
                  style={ytStyles.seekTrack}
                  {...seekPan.panHandlers}>
                  {/* buffered bg */}
                  <View style={ytStyles.seekBg} />
                  {/* played */}
                  <View style={[ytStyles.seekFill, { width: `${progress * 100}%`, backgroundColor: accentColor }]} />
                  {/* thumb */}
                  <View style={[ytStyles.seekThumb, { left: `${progress * 100}%`, backgroundColor: accentColor }]} />
                </View>

                <Text style={ytStyles.timeText}>{fmtDuration(duration)}</Text>
              </View>

            </Animated.View>
          )}
        </View>

        {/* ════ INFO PANEL (below player) ════ */}
        <View style={ytStyles.infoPanel}>
          <Text style={ytStyles.infoTitle} numberOfLines={2}>{title}</Text>
          <Text style={[ytStyles.infoMeta, { color: accentColor }]}>
            {fmtDuration(video.duration)} · {video.width}×{video.height}
          </Text>

          <View style={ytStyles.divider} />

          {/* Up next list */}
          <Text style={ytStyles.sectionHead}>Up next</Text>
          {allVideos.map((v, i) => {
            if (i === currentIndex) return null;
            const nextTitle = `${folderTitle} — Video ${i + 1}`;
            return (
              <TouchableOpacity
                key={v.id}
                style={ytStyles.upNextRow}
                activeOpacity={0.75}
                onPress={() => onSelectVideo(v, i)}>
                <View style={[ytStyles.upNextThumb, { backgroundColor: accentColor + '20' }]}>
                  <Ionicons name="play-circle" size={26} color={accentColor} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={ytStyles.upNextTitle} numberOfLines={2}>{nextTitle}</Text>
                  <Text style={ytStyles.upNextMeta}>⏱ {fmtDuration(v.duration)}</Text>
                </View>
             
              </TouchableOpacity>
            );
          })}
        </View>

      </View>
    </Modal>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export const EducationScreen: React.FC = () => {
  const [selectedFolder, setSelectedFolder] = useState<Folder | null>(null);
  const [activeVideo, setActiveVideo]       = useState<{ pexels: PexelsVideo; title: string; index: number } | null>(null);
  const [folderLoading, setFolderLoading]   = useState(true);
  const [videoLoading, setVideoLoading]     = useState(false);
  const [videos, setVideos]                 = useState<PexelsVideo[]>([]);
  const [fetchError, setFetchError]         = useState<string | null>(null);
  const [query, setQuery]                   = useState('');

  // Initial screen load delay
  useEffect(() => {
    const t = setTimeout(() => setFolderLoading(false), 800);
    return () => clearTimeout(t);
  }, []);

  // Fetch videos when a folder is selected
  useEffect(() => {
    if (!selectedFolder) return;
    setVideoLoading(true);
    setFetchError(null);
    setVideos([]);

    searchPexelsVideos(selectedFolder.searchQuery, 8)
      .then(setVideos)
      .catch(e => setFetchError(e.message ?? 'Failed to load videos'))
      .finally(() => setVideoLoading(false));
  }, [selectedFolder]);

  if (folderLoading) return <EducationScreenSkeleton />;

  // ── Folder video list view ────────────────────────────────────────────────
  if (selectedFolder) {
    const filtered = query.trim()
      ? videos.filter((_, i) => `video ${i + 1}`.includes(query.toLowerCase()))
      : videos;

    return (
      <SafeAreaView style={styles.safe} edges={['bottom']}>
        <ScreenHeader
          title={selectedFolder.title}
          subtitle={videoLoading ? 'Loading…' : `${videos.length} videos`}
          onBackPress={() => { setSelectedFolder(null); setQuery(''); setVideos([]); }}
        />

        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={colors.text.secondary} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search videos..."
            placeholderTextColor={colors.text.secondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
        </View>

        {videoLoading && <VideoListSkeleton />}

        {fetchError && !videoLoading && (
          <View style={styles.centeredMsg}>
            <Ionicons name="cloud-offline-outline" size={40} color={colors.error} />
            <Text style={styles.errorMsg}>{fetchError}</Text>
            <TouchableOpacity
              style={[styles.retryBtn, { backgroundColor: selectedFolder.color }]}
              onPress={() => {
                setVideoLoading(true);
                setFetchError(null);
                searchPexelsVideos(selectedFolder.searchQuery, 8)
                  .then(setVideos)
                  .catch(e => setFetchError(e.message))
                  .finally(() => setVideoLoading(false));
              }}>
              <Text style={styles.retryBtnTxt}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {!videoLoading && !fetchError && (
          <FlatList
            key="videos"
            data={filtered}
            keyExtractor={v => String(v.id)}
            contentContainerStyle={styles.list}
            renderItem={({ item, index }) => {
              const videoTitle = `${selectedFolder.title} — Video ${index + 1}`;
              return (
                <TouchableOpacity
                  style={styles.videoItem}
                  activeOpacity={0.75}
                  onPress={() => setActiveVideo({ pexels: item, title: videoTitle, index })}>
                  {/* thumbnail */}
                  <View style={[styles.thumbContainer, { backgroundColor: selectedFolder.color + '15' }]}>
                    <Ionicons name="play-circle" size={30} color={selectedFolder.color} />
                  </View>
                  <View style={styles.videoInfo}>
                    <Text style={styles.videoNum}>Video {index + 1}</Text>
                    <Text style={styles.videoTitle} numberOfLines={2}>{videoTitle}</Text>
                    <Text style={styles.videoDuration}>⏱ {fmtDuration(item.duration)}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={18} color={colors.text.tertiary} />
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={
              <View style={styles.centeredMsg}>
                <Ionicons name="videocam-off-outline" size={40} color={colors.text.secondary} />
                <Text style={styles.emptyText}>No videos found</Text>
              </View>
            }
          />
        )}

        {activeVideo && (
          <VideoPlayerModal
            video={activeVideo.pexels}
            title={activeVideo.title}
            accentColor={selectedFolder.color}
            allVideos={videos}
            currentIndex={activeVideo.index}
            folderTitle={selectedFolder.title}
            onClose={() => setActiveVideo(null)}
            onSelectVideo={(v, i) =>
              setActiveVideo({ pexels: v, index: i, title: `${selectedFolder.title} — Video ${i + 1}` })
            }
          />
        )}
      </SafeAreaView>
    );
  }

  // ── Folder grid view ─────────────────────────────────────────────────────
  const filteredFolders = query.trim()
    ? FOLDERS.filter(f => f.title.toLowerCase().includes(query.toLowerCase()))
    : FOLDERS;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScreenHeader title="Education" subtitle="Learn to invest smarter" />

      <View style={styles.searchBar}>
        <Ionicons name="search" size={18} color={colors.text.secondary} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search topics..."
          placeholderTextColor={colors.text.secondary}
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
      </View>

      <FlatList
        key="folders"
        data={filteredFolders}
        keyExtractor={f => f.id}
        contentContainerStyle={styles.list}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.centeredMsg}>
            <Ionicons name="search-outline" size={40} color={colors.text.secondary} />
            <Text style={styles.emptyText}>No topics found</Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.folderCard, { borderTopColor: item.color }]}
            activeOpacity={0.75}
            onPress={() => setSelectedFolder(item)}>
            <View style={[styles.folderIcon, { backgroundColor: item.color + '20' }]}>
              <Text style={styles.folderEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.folderTitle}>{item.title}</Text>
            <Text style={[styles.folderCount, { color: item.color }]}>Tap to explore</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  list: { padding: spacing.base, paddingBottom: spacing['3xl'] },
  row:  { gap: spacing.sm, marginBottom: spacing.sm },

  // Folders
  folderCard: {
    flex: 1, backgroundColor: colors.surface, borderRadius: 12, padding: spacing.base,
    borderTopWidth: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3,
  },
  folderIcon:  { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm },
  folderEmoji: { fontSize: 24 },
  folderTitle: { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary, marginBottom: 4 },
  folderCount: { fontSize: fontSizes.xs, fontWeight: '600' },

  // Video list
  videoItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.surface,
    borderRadius: 12, padding: spacing.md, marginBottom: spacing.sm,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  thumbContainer: {
    width: 80, height: 56, borderRadius: 10,
    alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
  },
  videoInfo:     { flex: 1 },
  videoNum:      { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  videoTitle:    { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary, marginTop: 2 },
  videoDuration: { fontSize: fontSizes.xs, color: colors.text.secondary, marginTop: 3 },

  // Player modal
  modalContainer: { flex: 1, backgroundColor: '#000' },
  playerWrapper:  { width: SCREEN_WIDTH, height: SCREEN_WIDTH * 9 / 16, backgroundColor: '#000' },
  player:         { ...StyleSheet.absoluteFill },
  overlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)', gap: 10,
  },
  overlayText:  { color: 'rgba(255,255,255,0.85)', fontSize: fontSizes.xs },
  playerClose:  { position: 'absolute', top: 12, left: 12 },
  modalInfo:    { flex: 1, backgroundColor: colors.background, padding: spacing.lg },
  modalTitle:   { fontSize: fontSizes.lg, fontWeight: '800', color: colors.text.primary, marginBottom: 4 },
  modalSub:     { fontSize: fontSizes.xs, fontWeight: '600', marginBottom: spacing.md },
  progressTrack:{ height: 4, backgroundColor: colors.divider, borderRadius: 2, marginBottom: 6, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 2 },
  timeRow:      { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.lg },
  timeLabel:    { fontSize: fontSizes.xs, color: colors.text.secondary, fontWeight: '500' },
  playBtn: {
    flexDirection: 'row', borderRadius: 12, paddingVertical: spacing.md,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  playBtnTxt: { color: '#fff', fontSize: fontSizes.base, fontWeight: '700' },
  closeBtn: {
    flexDirection: 'row', borderRadius: 12, paddingVertical: spacing.md,
    alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surface,
    borderWidth: 1, borderColor: colors.border,
  },
  closeBtnTxt: { color: colors.text.secondary, fontSize: fontSizes.base, fontWeight: '600' },
  btnIcon: { marginRight: spacing.xs },

  // Search
  searchBar: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: colors.surface, borderRadius: 12,
    marginHorizontal: spacing.base, marginTop: spacing.sm, marginBottom: spacing.xs,
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  searchIcon:  { marginRight: spacing.sm },
  searchInput: { flex: 1, fontSize: fontSizes.sm, color: colors.text.primary, padding: 0 },

  // States
  centeredMsg: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 60, gap: spacing.sm },
  emptyText:   { fontSize: fontSizes.sm, color: colors.text.secondary, fontWeight: '600' },
  errorMsg:    { fontSize: fontSizes.sm, color: colors.error, fontWeight: '600', textAlign: 'center', paddingHorizontal: spacing.lg },
  retryBtn:    { borderRadius: 10, paddingVertical: spacing.sm, paddingHorizontal: spacing.lg, marginTop: spacing.xs },
  retryBtnTxt: { color: '#fff', fontWeight: '700', fontSize: fontSizes.sm },
});

// ─── YouTube-style player styles ─────────────────────────────────────────────

const ytStyles = StyleSheet.create({
  root:         { flex: 1, backgroundColor: '#000' },
  playerBox:    { backgroundColor: '#000', overflow: 'hidden' },

  // Spinner / error centred on player
  centerOverlay: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.45)', gap: 10,
  },
  errorTxt: { color: '#fff', fontSize: fontSizes.sm, fontWeight: '600' },

  // Semi-transparent controls layer
  controlsOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.38)',
  },

  // Top bar: back chevron + title + fullscreen
  topBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingTop: 45, gap: 10,
  },
  topTitle: {
    flex: 1, color: '#fff', fontSize: fontSizes.sm,
    fontWeight: '700', textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 3,
  },

  // Centre row: skip-back, play/pause, skip-forward
  centreRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'center', gap: 36,
  },
  playCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center', justifyContent: 'center',
  },
  skipBtn:   { alignItems: 'center', justifyContent: 'center' },
  skipLabel: { color: '#fff', fontSize: 11, fontWeight: '700', marginTop: 2 },

  // Bottom bar: time + seek + duration
  bottomBar: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingBottom: 14, gap: 10,
  },
  timeText: { color: '#fff', fontSize: 12, fontWeight: '600', minWidth: 36, textAlign: 'center' },
  seekTrack: {
    flex: 1, height: 20, justifyContent: 'center',
  },
  seekBg: {
    position: 'absolute', left: 0, right: 0,
    height: 3, borderRadius: 2, backgroundColor: 'rgba(255,255,255,0.3)',
  },
  seekFill: {
    position: 'absolute', left: 0,
    height: 3, borderRadius: 2,
  },
  seekThumb: {
    position: 'absolute', width: 14, height: 14,
    borderRadius: 7, marginLeft: -7,
    top: 3, borderWidth: 2, borderColor: '#fff',
  },

  // Info panel below player
  infoPanel:    { flex: 1, backgroundColor: colors.background, padding: spacing.base },
  infoTitle:    { fontSize: fontSizes.base, fontWeight: '800', color: colors.text.primary, marginBottom: 4 },
  infoMeta:     { fontSize: fontSizes.xs, fontWeight: '600', marginBottom: spacing.md },
  divider:      { height: 1, backgroundColor: colors.divider, marginVertical: spacing.sm },
  sectionHead:  { fontSize: fontSizes.sm, fontWeight: '700', color: colors.text.primary, marginBottom: spacing.sm },
  upNextRow:    { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  upNextThumb:  { width: 72, height: 50, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  upNextTitle:  { fontSize: fontSizes.sm, fontWeight: '600', color: colors.text.primary },
  upNextMeta:     { fontSize: fontSizes.xs, color: colors.text.secondary, marginTop: 3 },
  upNextBadge:    { borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2, marginLeft: 6 },
  upNextBadgeTxt: { color: '#fff', fontSize: 10, fontWeight: '700' },
});
