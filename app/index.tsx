import React, { useEffect, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import MapView, { Marker } from 'react-native-maps';
import MenuSection from "./components/menu/MenuSection";

const API = "https://jlorenzo.ddns.net/carta_restaurante";
const USER = "0110";

interface Category {
  id: number;
  name: string;
  image?: string;
  products: {
    id: number;
    name: string;
    price: number;
  }[];
}

export default function IndexScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [categoryImages, setCategoryImages] = useState<{ [key: number]: string }>({});

  const cafeLocation = {
    latitude: 28.0916,
    longitude: -15.4190,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005,
  };

  const loadData = async () => {
    try {
      const res = await fetch(`${API}/categorias/?usuario_id=${USER}`);
      const json = await res.json();
      const categorias = json.data ?? [];

      const categoriasConProductos: Category[] = await Promise.all(
        categorias.map(async (cat: any) => {
          const resProd = await fetch(`${API}/productos/${cat.id}?usuario_id=${USER}`);
          const jsonProd = await resProd.json();
          const productos = jsonProd.data ?? [];

          return {
            id: cat.id,
            name: cat.nombre,
            image: categoryImages[cat.id] || undefined,
            products: productos.map((p: any) => ({
              id: p.id,
              name: p.nombre,
              price: parseFloat(p.precio),
            })),
          };
        })
      );

      setCategories(categoriasConProductos);
    } catch {
      Alert.alert("Error", "No se pudo cargar el menú");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const createCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await fetch(`${API}/categorias/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USER, nombre: newCategory.trim() }),
      });
      setNewCategory("");
      loadData();
    } catch {
      Alert.alert("Error", "No se pudo crear la categoría");
    }
  };

  const updateCategory = (id: number, name: string, image?: string) => {
    // Actualizar imagen localmente
    if (image !== undefined) {
      setCategoryImages(prev => {
        const updated = { ...prev };
        if (image === "") {
          delete updated[id];
        } else {
          updated[id] = image;
        }
        return updated;
      });
    }

    // Actualizar estado de categorías
    setCategories(prev =>
      prev.map(cat =>
        cat.id === id
          ? { ...cat, name: name.trim(), image: image === "" ? undefined : (image || cat.image) }
          : cat
      )
    );

    // Actualizar nombre en API (sin imagen)
    if (name !== categories.find(c => c.id === id)?.name) {
      fetch(`${API}/categorias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USER, nombre: name.trim() }),
      }).catch(() => {});
    }
  };

  const deleteCategory = async (id: number) => {
    try {
      await fetch(`${API}/categorias/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USER }),
      });
      loadData();
    } catch {
      Alert.alert("Error", "No se pudo eliminar la categoría");
    }
  };

  const createProduct = async (categoryId: number, name: string, price: string) => {
    try {
      await fetch(`${API}/productos/${categoryId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: USER,
          nombre: name.trim(),
          precio: parseFloat(price),
          orden: 1,
        }),
      });
      loadData();
    } catch {
      Alert.alert("Error", "No se pudo crear el producto");
    }
  };

  const updateProduct = async (id: number, name: string, price: string) => {
    try {
      await fetch(`${API}/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: USER,
          nombre: name.trim(),
          precio: parseFloat(price),
        }),
      });
      loadData();
    } catch {
      Alert.alert("Error", "No se pudo actualizar el producto");
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await fetch(`${API}/productos/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuario_id: USER }),
      });
      loadData();
    } catch {
      Alert.alert("Error", "No se pudo eliminar el producto");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.page}>
      <View style={styles.panel}>
        <Text style={styles.title}>CAMPER CAFÉ</Text>
        <Text style={styles.subtitle}>Est. 2025</Text>

        <TextInput
          style={styles.input}
          placeholder="Nombre nueva categoría"
          placeholderTextColor="#ccc"
          value={newCategory}
          onChangeText={setNewCategory}
        />

        <Pressable style={styles.button} onPress={createCategory}>
          <Text style={styles.buttonText}>Nueva Categoría</Text>
        </Pressable>

        {categories.map((cat) => (
          <MenuSection
            key={cat.id}
            category={cat}
            onUpdateCategory={updateCategory}
            onDeleteCategory={deleteCategory}
            onCreateProduct={createProduct}
            onUpdateProduct={updateProduct}
            onDeleteProduct={deleteProduct}
          />
        ))}

        <View style={styles.mapSection}>
          <Text style={styles.mapTitle}> Estamos Aquí</Text>
          <MapView style={styles.map} initialRegion={cafeLocation}>
            <Marker
              coordinate={{
                latitude: cafeLocation.latitude,
                longitude: cafeLocation.longitude,
              }}
              title="Camper Café"
              description="Nuestra ubicación"
              pinColor="#4a1f1a"
            />
          </MapView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  page: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "transparent",
  },
  panel: {
    width: "90%",
    maxWidth: 600,
    backgroundColor: "#e6c29f",
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4a1f1a",
  },
  title: {
    fontSize: 32,
    color: "#4a1f1a",
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    color: "#4a1f1a",
    textAlign: "center",
    marginBottom: 20,
    fontSize: 18,
  },
  input: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#4a1f1a",
  },
  button: {
    backgroundColor: "#4a1f1a",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  mapSection: {
    marginTop: 30,
    marginBottom: 10,
  },
  mapTitle: {
    fontSize: 20,
    color: "#4a1f1a",
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  map: {
    width: "100%",
    height: 350,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#4a1f1a",
  },
});