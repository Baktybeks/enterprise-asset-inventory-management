import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from "react-native";

type CategorySelectProps = {
  selected: string | null;
  setSelected: (value: string) => void;
};

const CATEGORIES = ["Электроника", "Мебель", "Канцтовары", "Прочее"];

const CategorySelect = ({ selected, setSelected }: CategorySelectProps) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelect = (value: string) => {
    setSelected(value);
    setModalVisible(false);
  };

  return (
    <View>
      <Text style={styles.label}>Категория</Text>
      <TouchableOpacity
        style={styles.selectBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.selectText}>
          {selected || "Выберите категорию"}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <FlatList
              data={CATEGORIES}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    marginBottom: 10,
    color: "#4B5563",
  },
  selectBox: {
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  selectText: {
    color: "#111827",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 10,
  },
  option: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  optionText: {
    fontSize: 16,
    color: "#111827",
  },
});

export default CategorySelect;
