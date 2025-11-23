import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function App() {
  const [menu, setMenu] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  const API_BASE = "https://jlorenzo.ddns.net/carta_restaurante";
  const USER_ID = "0110";

  const cargarMenu = async () => {
    try {
      const resCat = await fetch(`${API_BASE}/categorias.php?usuario_id=${USER_ID}`);
      const categorias = await resCat.json();

      if (!categorias || categorias.length === 0) {
        setMenu([]);
        return;
      }

      const productosPorCategoria = await Promise.all(
        categorias.map(async (cat) => {
          const res = await fetch(
            `${API_BASE}/productos.php?categoria_id=${cat.id}&usuario_id=${USER_ID}`
          );
          return await res.json();
        })
      );

      const formateado = categorias.map((cat, i) => ({
        id: cat.id,
        name: cat.nombre,
        photoURL:
          cat.icono || "https://img.icons8.com/ios-glyphs/50/4a1f1a/meal.png",
        products: (productosPorCategoria[i] || []).map((p) => ({
          id: p.id,
          name: p.nombre,
          price: parseFloat(p.precio),
        })),
      }));

      setMenu(formateado);
    } catch (error) {
      Alert.alert("Error", "No se pudo cargar el menú.");
    }
  };

  useEffect(() => {
    cargarMenu();
  }, []);

  const addCategory = async () => {
    if (!nuevaCategoria.trim()) return;

    try {
      const formData = new FormData();
      formData.append("nombre", nuevaCategoria);
      formData.append("usuario_id", USER_ID);

      await fetch(`${API_BASE}/crear_categoria.php`, {
        method: "POST",
        body: formData,
      });

      setNuevaCategoria("");
      cargarMenu();
    } catch {
      Alert.alert("Error", "No se pudo crear la categoría.");
    }
  };

  const deleteCategory = (id) => {
    Alert.alert(
      "Confirmar",
      "¿Eliminar esta categoría?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await fetch(`${API_BASE}/eliminar_categoria.php?id=${id}`, {
                method: "DELETE",
              });
              cargarMenu();
            } catch {
              Alert.alert("Error", "No se pudo eliminar.");
            }
          },
        },
      ]
    );
  };

  return (
    <ImageBackground
      source={{ uri: "https://cdn.freecodecamp.org/curriculum/css-cafe/beans.jpg" }}
      style={styles.background}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>CAMPER CAFÉ</Text>
        <Text style={styles.subtitle}>Est. {new Date().getFullYear()}</Text>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Nombre nueva categoría"
            placeholderTextColor="#ccc"
            value={nuevaCategoria}
            onChangeText={setNuevaCategoria}
          />

          <Pressable style={styles.button} onPress={addCategory}>
            <Text style={styles.buttonText}>Nueva Categoría</Text>
          </Pressable>
        </View>

        <Text style={styles.jsonTitle}>MENÚ:</Text>
        <Text style={styles.jsonText}>{JSON.stringify(menu, null, 2)}</Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 20,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
  },
  form: {
    gap: 12,
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.85)",
    padding: 10,
    borderRadius: 6,
  },
  button: {
    backgroundColor: "#4a1f1a",
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  jsonTitle: {
    fontSize: 18,
    color: "#fff",
    marginTop: 20,
  },
  jsonText: {
    color: "#fff",
    marginTop: 10,
    marginBottom: 200,
  },
});
