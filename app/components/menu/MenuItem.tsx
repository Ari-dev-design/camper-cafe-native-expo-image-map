import React, { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export interface Product {
  id: number;
  name: string;
  price: number;
}

interface MenuItemProps {
  product: Product;
  onUpdate: (name: string, price: string) => void;
  onDelete: () => void;
}

export default function MenuItem({ product, onUpdate, onDelete }: MenuItemProps) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(String(product.price));

  return (
    <View style={styles.item}>

      {edit ? (
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={name}
            onChangeText={setName}
          />

          <TextInput
            style={[styles.input, styles.priceInput]}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
          />

          <Pressable
            style={[styles.btn, styles.save]}
            onPress={() => {
              onUpdate(name, price);
              setEdit(false);
            }}
          >
            <Text style={styles.btnText}>Guardar</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, styles.cancel]}
            onPress={() => setEdit(false)}
          >
            <Text style={styles.btnText}>Cancelar</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.row}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price}€</Text>

          <Pressable onPress={() => setEdit(true)} style={styles.iconButton}>
            <Text style={styles.icon}>✏️</Text>
          </Pressable>

          <Pressable onPress={onDelete} style={styles.iconButton}>
            <Text style={styles.icon}>🗑️</Text>
          </Pressable>
        </View>
      )}

    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    borderBottomWidth: 1,
    borderColor: "rgba(74,31,26,0.2)",
    paddingVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  name: {
    flex: 1,
    fontSize: 16,
    color: "#4a1f1a",
    fontWeight: "bold",
  },

  price: {
    width: 60,
    textAlign: "right",
    fontWeight: "bold",
    color: "#4a1f1a",
    marginRight: 10,
  },

  input: {
    backgroundColor: "white",
    padding: 6,
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 4,
    marginRight: 8,
  },

  priceInput: {
    width: 70,
  },

  btn: {
    padding: 6,
    borderRadius: 4,
    marginLeft: 4,
  },

  save: {
    backgroundColor: "#4a1f1a",
  },

  cancel: {
    backgroundColor: "#ff0202",
  },

  btnText: {
    color: "white",
    fontWeight: "bold",
  },

  iconButton: {
    marginLeft: 6,
  },

  icon: {
    fontSize: 18,
  },
});
