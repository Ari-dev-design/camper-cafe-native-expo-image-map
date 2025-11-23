import * as ImagePicker from 'expo-image-picker';
import React, { useState } from "react";
import { Alert, Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import MenuItem, { Product } from "./MenuItem";

export interface Category {
  id: number;
  name: string;
  image?: string;
  products: Product[];
}

interface MenuSectionProps {
  category: Category;
  onUpdateCategory: (id: number, name: string, image?: string) => void;
  onDeleteCategory: (id: number) => void;
  onCreateProduct: (categoryId: number, name: string, price: string) => void;
  onUpdateProduct: (productId: number, name: string, price: string) => void;
  onDeleteProduct: (productId: number) => void;
}

export default function MenuSection({
  category,
  onUpdateCategory,
  onDeleteCategory,
  onCreateProduct,
  onUpdateProduct,
  onDeleteProduct,
}: MenuSectionProps) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");

  const pickImage = async (useCamera: boolean) => {
    try {
      let result;

      if (useCamera) {
        const permission = await ImagePicker.requestCameraPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permiso denegado", "Necesitas dar permiso para usar la cámara.");
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });
      } else {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
          Alert.alert("Permiso denegado", "Necesitas dar permiso para acceder a la galería.");
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.5,
          base64: true,
        });
      }

      if (!result.canceled && result.assets[0].base64) {
        const base64Image = `data:image/jpeg;base64,${result.assets[0].base64}`;
        onUpdateCategory(category.id, category.name, base64Image);
        Alert.alert("Éxito", "Imagen añadida correctamente");
      }
    } catch (error) {
      Alert.alert("Error", "No se pudo seleccionar la imagen.");
    }
  };

  const showImageOptions = () => {
    Alert.alert(
      "Añadir Imagen",
      "Selecciona una opción",
      [
        { text: "📷 Tomar Foto", onPress: () => pickImage(true) },
        { text: "🖼️ Elegir de Galería", onPress: () => pickImage(false) },
        { text: "Cancelar", style: "cancel" }
      ]
    );
  };

  const deleteImage = () => {
    Alert.alert(
      "Confirmar",
      "¿Eliminar la imagen de esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => onUpdateCategory(category.id, category.name, "")
        }
      ]
    );
  };

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        {editing ? (
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={name}
            onChangeText={setName}
          />
        ) : (
          <Text style={styles.title}>{category.name}</Text>
        )}

        <View style={styles.actions}>
          {editing ? (
            <>
              <Pressable
                style={styles.save}
                onPress={() => {
                  onUpdateCategory(category.id, name, category.image);
                  setEditing(false);
                }}
              >
                <Text style={styles.saveText}>Guardar</Text>
              </Pressable>

              <Pressable
                style={styles.cancel}
                onPress={() => setEditing(false)}
              >
                <Text style={styles.cancelText}>Cancelar</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable onPress={() => setEditing(true)}>
                <Text style={styles.icon}>✏️</Text>
              </Pressable>

              <Pressable onPress={() => onDeleteCategory(category.id)}>
                <Text style={styles.icon}>🗑️</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      <View style={styles.imageSection}>
        {category.image ? (
          <>
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <View style={styles.imageButtons}>
              <Pressable style={styles.changeButton} onPress={showImageOptions}>
                <Text style={styles.buttonText}>🔄 Cambiar</Text>
              </Pressable>
              <Pressable style={styles.deleteButton} onPress={deleteImage}>
                <Text style={styles.buttonText}>🗑️ Eliminar</Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Pressable style={styles.addImageButton} onPress={showImageOptions}>
            <Text style={styles.buttonText}>📷 Añadir Imagen</Text>
          </Pressable>
        )}
      </View>

      {category.products.map((product) => (
        <MenuItem
          key={product.id}
          product={product}
          onUpdate={(name, price) => onUpdateProduct(product.id, name, price)}
          onDelete={() => onDeleteProduct(product.id)}
        />
      ))}

      <View style={styles.newProduct}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          placeholder="Nombre producto"
          value={newName}
          onChangeText={setNewName}
        />
        <TextInput
          style={[styles.input, { width: 70 }]}
          placeholder="Precio"
          keyboardType="numeric"
          value={newPrice}
          onChangeText={setNewPrice}
        />

        <Pressable
          style={styles.save}
          onPress={() => {
            if (!newName || !newPrice) return;
            onCreateProduct(category.id, newName, newPrice);
            setNewName("");
            setNewPrice("");
          }}
        >
          <Text style={styles.saveText}>Nuevo</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
    paddingBottom: 10,
    borderBottomWidth: 2,
    borderColor: "#4a1f1a",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    color: "#4a1f1a",
    fontWeight: "bold",
    flex: 1,
  },
  input: {
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#4a1f1a",
  },
  actions: {
    flexDirection: "row",
  },
  icon: { 
    fontSize: 22,
    marginLeft: 10,
  },
  save: {
    backgroundColor: "#4a1f1a",
    padding: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  saveText: {
    color: "white",
  },
  cancel: {
    backgroundColor: "#ff0202",
    padding: 6,
    borderRadius: 4,
    marginLeft: 10,
  },
  cancelText: {
    color: "white",
  },
  imageSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  categoryImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#4a1f1a",
    marginBottom: 8,
  },
  imageButtons: {
    flexDirection: "row",
    gap: 8,
  },
  addImageButton: {
    backgroundColor: "#4a1f1a",
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  changeButton: {
    flex: 1,
    backgroundColor: "#4a1f1a",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff0202",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  newProduct: {
    flexDirection: "row",
    marginTop: 14,
    alignItems: "center",
  },
});