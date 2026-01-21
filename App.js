import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView } from "react-native";
import { summarize } from "./src/summarizer";
import { saveJournalEntry } from "./src/journalStorage";
import { today } from "./src/utils";

export default function App() {
  const [reflection, setReflection] = useState("");
  const [summaryStyle, setSummaryStyle] = useState("bullets");
  const [tags, setTags] = useState("");
  const [output, setOutput] = useState([]);

  const handleSave = async () => {
    const summary = summarize(reflection, summaryStyle);
    const entry = {
      date: today(),
      summary,
      tags: tags.split(",").map(t => t.trim()),
    };

    await saveJournalEntry(today(), entry);
    setOutput(summary);
    setReflection("");
  };

  return (
    <ScrollView style={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: "bold" }}>
        Reflective Journal
      </Text>

      <TextInput
        placeholder="Write your reflection..."
        multiline
        value={reflection}
        onChangeText={setReflection}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <TextInput
        placeholder="Tags (e.g. gratitude, challenge)"
        value={tags}
        onChangeText={setTags}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />

      <Button title="Save Reflection" onPress={handleSave} />

      <Text style={{ marginTop: 20, fontWeight: "bold" }}>
        Today's Summary:
      </Text>

      {Array.isArray(output)
        ? output.map((line, i) => <Text key={i}>{line}</Text>)
        : <Text>{output}</Text>}
    </ScrollView>
  );
}
