import { useCallback, useMemo, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  ScrollView,
  SectionList,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ProductCard from "./components/ProductCard";
import { categories, products } from "./data/products";

const PURPLE = "#6C3CE1";
const PURPLE_DARK = "#4A25A9";
const PURPLE_LIGHT = "#EDE8FF";
const BG = "#F4F2FF";

// ─── SORT OPTIONS ────────────────────────────────────────────────────────────
const SORT_OPTIONS = [
  { key: "default", label: "Terbaru" },
  { key: "price_asc", label: "Harga ↑" },
  { key: "price_desc", label: "Harga ↓" },
  { key: "rating", label: "Rating ↑" },
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [isGrid, setIsGrid] = useState(false);
  const [isSectionMode, setIsSectionMode] = useState(false);
  const [sortKey, setSortKey] = useState("default");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshCount, setRefreshCount] = useState(0);

  // ─── FILTER + SORT ─────────────────────────────────────────────────────────
  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory !== "Semua") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(q));
    }

    switch (sortKey) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return result;
  }, [searchQuery, selectedCategory, sortKey]);

  // ─── SECTION DATA ───────────────────────────────────────────────────────────
  const sectionData = useMemo(() => {
    const catList = categories.filter((c) => c !== "Semua");
    return catList
      .map((cat) => ({
        title: cat,
        data: filteredProducts.filter((p) => p.category === cat),
      }))
      .filter((s) => s.data.length > 0);
  }, [filteredProducts]);

  // ─── PULL TO REFRESH ────────────────────────────────────────────────────────
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshCount((c) => c + 1);
      setRefreshing(false);
    }, 1200);
  }, []);

  // ─── RENDER ITEM ────────────────────────────────────────────────────────────
  const renderItem = useCallback(
    ({ item }) => <ProductCard item={item} isGrid={isGrid} />,
    [isGrid],
  );

  const keyExtractor = useCallback((item) => item.id, []);

  // ─── EMPTY STATE ────────────────────────────────────────────────────────────
  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>🔍</Text>
      <Text style={styles.emptyTitle}>Produk Tidak Ditemukan</Text>
      <Text style={styles.emptyHint}>
        Coba ubah kata kunci atau pilih kategori yang berbeda
      </Text>
    </View>
  );

  // ─── SECTION HEADER ─────────────────────────────────────────────────────────
  const renderSectionHeader = ({ section }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <Text style={styles.sectionCount}>{section.data.length} produk</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={PURPLE_DARK} barStyle="light-content" />

      {/* ─── HEADER ─── */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>🛍️ ShopList</Text>
          <Text style={styles.headerSub}>
            {filteredProducts.length} produk ditampilkan
            {refreshCount > 0 ? ` · refresh #${refreshCount}` : ""}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {/* Toggle SectionList */}
          <TouchableOpacity
            style={[styles.iconBtn, isSectionMode && styles.iconBtnActive]}
            onPress={() => setIsSectionMode((v) => !v)}
          >
            <Text style={styles.iconBtnText}>§</Text>
          </TouchableOpacity>
          {/* Toggle Grid/List */}
          <TouchableOpacity
            style={[styles.iconBtn, isGrid && styles.iconBtnActive]}
            onPress={() => setIsGrid((v) => !v)}
          >
            <Text style={styles.iconBtnText}>{isGrid ? "▤" : "⊞"}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ─── SEARCH BAR ─── */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari produk..."
          placeholderTextColor="#AAA"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            onPress={() => setSearchQuery("")}
            style={styles.clearBtn}
          >
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ─── CATEGORY CHIPS ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.chipScroll}
        contentContainerStyle={styles.chipContainer}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            style={[styles.chip, selectedCategory === cat && styles.chipActive]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategory === cat && styles.chipTextActive,
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── SORT CHIPS ─── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.sortScroll}
        contentContainerStyle={styles.chipContainer}
      >
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[
              styles.sortChip,
              sortKey === opt.key && styles.sortChipActive,
            ]}
            onPress={() => setSortKey(opt.key)}
          >
            <Text
              style={[
                styles.sortChipText,
                sortKey === opt.key && styles.sortChipTextActive,
              ]}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ─── PRODUCT LIST ─── */}
      {isSectionMode ? (
        <SectionList
          sections={sectionData}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled={true}
          contentContainerStyle={[
            styles.listContent,
            filteredProducts.length === 0 && styles.listContentEmpty,
          ]}
          ListEmptyComponent={ListEmptyComponent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <FlatList
          data={filteredProducts}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={isGrid ? 2 : 1}
          key={isGrid ? "grid" : "list"}
          contentContainerStyle={[
            styles.listContent,
            isGrid && styles.listContentGrid,
            filteredProducts.length === 0 && styles.listContentEmpty,
          ]}
          ListEmptyComponent={ListEmptyComponent}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          initialNumToRender={8}
          maxToRenderPerBatch={6}
          windowSize={10}
          removeClippedSubviews={true}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
  },

  // HEADER
  header: {
    backgroundColor: PURPLE,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerSub: {
    fontSize: 12,
    color: "rgba(255,255,255,0.75)",
    marginTop: 2,
  },
  headerActions: {
    flexDirection: "row",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },
  iconBtnActive: {
    backgroundColor: "#FFFFFF",
  },
  iconBtnText: {
    fontSize: 18,
    color: PURPLE,
    fontWeight: "700",
  },

  // SEARCH
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    paddingHorizontal: 14,
    height: 48,
    shadowColor: "#6C3CE1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#1A1A2E",
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 14,
    color: "#AAA",
    fontWeight: "700",
  },

  // CHIPS
  chipScroll: {
    marginTop: 10,
    maxHeight: 46,
  },
  chipContainer: {
    paddingHorizontal: 16,
    paddingVertical: 4,
    paddingRight: 24,
    flexDirection: "row",
    alignItems: "center",
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderColor: "#DDD",
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
  },
  chipText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#666",
  },
  chipTextActive: {
    color: "#FFFFFF",
  },

  // SORT
  sortScroll: {
    marginTop: 6,
    marginBottom: 4,
    maxHeight: 42,
  },
  sortChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1.5,
    borderColor: "transparent",
    marginRight: 8,
  },
  sortChipActive: {
    borderColor: PURPLE,
    backgroundColor: PURPLE_LIGHT,
  },
  sortChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: PURPLE,
  },
  sortChipTextActive: {
    color: PURPLE_DARK,
    fontWeight: "800",
  },

  // LIST
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  listContentGrid: {
    paddingHorizontal: 10,
  },
  listContentEmpty: {
    flexGrow: 1,
  },

  // EMPTY STATE
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 32,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1A1A2E",
    marginBottom: 8,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    lineHeight: 20,
  },

  // SECTION HEADER
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: BG,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0DAFF",
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: PURPLE_DARK,
  },
  sectionCount: {
    fontSize: 12,
    color: "#888",
    fontWeight: "600",
  },
});
