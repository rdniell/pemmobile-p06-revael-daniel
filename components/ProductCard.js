import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const ProductCard = ({ item, isGrid = false }) => {
  const formatPrice = (price) =>
    "Rp " + price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");

  const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5 ? 1 : 0;
    return "★".repeat(full) + (half ? "½" : "") + "☆".repeat(5 - full - half);
  };

  if (isGrid) {
    return (
      <TouchableOpacity style={styles.gridCard} activeOpacity={0.85}>
        <View style={styles.gridImageBox}>
          <Text style={styles.gridEmoji}>{item.image}</Text>
        </View>
        <View style={styles.gridInfo}>
          <Text style={styles.gridName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
          <Text style={styles.gridPrice}>{formatPrice(item.price)}</Text>
          <View style={styles.ratingRow}>
            <Text style={styles.starText}>{renderStars(item.rating)}</Text>
            <Text style={styles.ratingNum}>{item.rating}</Text>
          </View>
          <Text style={styles.soldText}>
            {item.sold.toLocaleString()} terjual
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity style={styles.listCard} activeOpacity={0.85}>
      <View style={styles.listImageBox}>
        <Text style={styles.listEmoji}>{item.image}</Text>
      </View>
      <View style={styles.listInfo}>
        <View style={styles.listTopRow}>
          <Text style={styles.listName} numberOfLines={2}>
            {item.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{item.category}</Text>
          </View>
        </View>
        <Text style={styles.listPrice}>{formatPrice(item.price)}</Text>
        <View style={styles.listBottomRow}>
          <View style={styles.ratingRow}>
            <Text style={styles.starText}>{renderStars(item.rating)}</Text>
            <Text style={styles.ratingNum}>{item.rating}</Text>
          </View>
          <Text style={styles.soldText}>
            {item.sold.toLocaleString()} terjual
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PURPLE = "#6C3CE1";
const PURPLE_LIGHT = "#EDE8FF";

const styles = StyleSheet.create({
  // LIST CARD
  listCard: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    shadowColor: "#6C3CE1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  listImageBox: {
    width: 76,
    height: 76,
    borderRadius: 12,
    backgroundColor: PURPLE_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  listEmoji: {
    fontSize: 38,
  },
  listInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  listTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 6,
  },
  listName: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#1A1A2E",
    lineHeight: 20,
  },
  listPrice: {
    fontSize: 16,
    fontWeight: "800",
    color: PURPLE,
    marginTop: 4,
  },
  listBottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },

  // GRID CARD
  gridCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    margin: 6,
    overflow: "hidden",
    shadowColor: "#6C3CE1",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  gridImageBox: {
    backgroundColor: PURPLE_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
  },
  gridEmoji: {
    fontSize: 44,
  },
  gridInfo: {
    padding: 10,
  },
  gridName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1A1A2E",
    lineHeight: 18,
    marginBottom: 4,
  },
  gridPrice: {
    fontSize: 14,
    fontWeight: "800",
    color: PURPLE,
    marginTop: 2,
    marginBottom: 4,
  },

  // SHARED
  categoryBadge: {
    backgroundColor: PURPLE_LIGHT,
    borderRadius: 6,
    paddingHorizontal: 7,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginBottom: 2,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: "600",
    color: PURPLE,
  },
  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  starText: {
    fontSize: 11,
    color: "#F5A623",
  },
  ratingNum: {
    fontSize: 11,
    fontWeight: "700",
    color: "#555",
  },
  soldText: {
    fontSize: 11,
    color: "#999",
  },
});

export default React.memo(ProductCard);
