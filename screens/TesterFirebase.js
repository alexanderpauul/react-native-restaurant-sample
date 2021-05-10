import React, { useState, useEffect } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from "react-native";
import firebase from "firebase/app";
import { map, size } from "lodash";
import moment from "moment";

export default function TesterFirebase({ navigation }) {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [startAt, setStartAt] = useState(null);

  const user = firebase.auth().currentUser;
  const ref = firebase.firestore().collection("todos");

  useEffect(() => {
    return ref
      .orderBy("createDate", "desc")
      .limitToLast(50)
      .onSnapshot((querySnapshot) => {
        const records = [];
        querySnapshot.forEach((doc) => {
          const { title, complete, createDate } = doc.data();

          records.push({
            id: doc.id,
            title,
            complete,
            createDate,
          });
        });

        setTodos(records);
      });
  }, []);

  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
      createDate: new Date(),
    });

    setTodo("");
  }

  return (
    <View>
      <View style={{ paddingHorizontal: 30 }}>
        <TextInput
          label={"New Todo"}
          value={todo}
          onChangeText={setTodo}
          style={{
            backgroundColor: "#FFFFFF",
            padding: 5,
            marginVertical: 10,
          }}
        />
        <Button onPress={() => addTodo()} title="Agregar Tarea" />
      </View>

      <FlatList
        style={{ padding: 20 }}
        data={todos}
        keyExtractor={(item) => item.id}
        renderItem={(record) => <Todo record={record} />}
      />
    </View>
  );
}

function Todo({ record, setLoading }) {
  const { id, title, complete } = record.item;

  async function toggleComplete(id) {
    await firebase.firestore().collection("todos").doc(id).update({
      complete: !complete,
    });
  }

  return (
    <TouchableOpacity onPress={() => toggleComplete(id)}>
      <View style={styles.viewList}>
        <Text style={styles.todoTile}>{title}</Text>

        {complete ? (
          <Text style={styles.todoComplete}>Completado</Text>
        ) : (
          <Text style={styles.todoUnComplete}>Pendiete</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  todoTile: {
    fontWeight: "bold",
  },
  todoComplete: {
    paddingTop: 2,
    color: "green",
  },
  todoUnComplete: {
    paddingTop: 2,
    color: "red",
  },
  viewList: {
    margin: 10,
  },
});
