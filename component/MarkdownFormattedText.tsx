// Create a new file: components/FormattedText.tsx
import React from "react";
import { Text, View } from "react-native";

interface FormattedTextProps {
  content: string;
}

export const MarkdownFormattedText: React.FC<FormattedTextProps> = ({ content }) => {
  const formatText = (text: string) => {
    const lines = text.split("\n");

    const markdownText = (part: string, partIndex: number) => {
      if (!part) return null;

      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <Text
            key={partIndex}
            style={{ fontWeight: "bold", color: "#2c3e50" }}
          >
            {part.slice(2, -2)}
          </Text>
        );
      }

      if (part.startsWith("##")) {
        return (
          <Text
            key={partIndex}
            style={{
              fontWeight: "bold",
              color: "#2c3e50",
              fontSize: 16,
              marginTop: 8,
            }}
          >
            {part.slice(2).trim()}
          </Text>
        );
      }

      if (part.startsWith("#")) {
        return (
          <Text
            key={partIndex}
            style={{
              fontWeight: "bold",
              color: "#2c3e50",
              fontSize: 18,
              marginTop: 10,
            }}
          >
            {part.slice(1).trim()}
          </Text>
        );
      }

      if (part.trim().startsWith("-") || part.trim().startsWith("•")) {
        return (
          <Text key={partIndex} style={{ color: "#555", marginLeft: 10 }}>
            {part}
          </Text>
        );
      }

      return (
        <Text key={partIndex} style={{ color: "#555" }}>
          {part}
        </Text>
      );
    };

    return lines.map((line, index) => {
      const parts = line.split(/(\*\*.*?\*\*)|(\#{2,3}\s.*)/g);

      return (
        <Text key={index} style={{ marginBottom: 4, lineHeight: 20 }}>
          {parts
            .filter(
              (part) => part !== undefined && part !== null && part !== ""
            )
            .map((part, partIndex) => {
              return markdownText(part, partIndex);
            })}
        </Text>
      );
    });
  };

  return <View>{formatText(content)}</View>;
};
