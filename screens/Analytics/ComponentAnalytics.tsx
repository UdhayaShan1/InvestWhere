import { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { styles as portfolioStyles } from "../Profile/styles";
import {
  BankEditForm,
  formatCurrency,
  PORTFOLIO_COLORS,
  portFolioStyles as styles,
} from "../../types/wealth.types";
import { Ionicons } from "@expo/vector-icons";
import { useAppSelector } from "../../store/rootTypes";
import { assetAllocationSelector } from "../../store/portfolio/portfolioSelector";

export default function ComponentAnalytics() {
  const [component, setComponent] = useState("");
  const [selectionModalVisible, setSelectionModalVisible] = useState(false);
  const [availComponents, setAvailableComponents] = useState<string[]>([]);
  const assetAllocation = useAppSelector(assetAllocationSelector);

  useEffect(() => {
    const components: string[] = [];
    if (assetAllocation) {
      Object.keys(assetAllocation).forEach((key) => components.push(key));
      setAvailableComponents(components);
    }
  }, [assetAllocation]);

  return (
    <>
      <View style={portfolioStyles.profileInfo}>
        <Text style={portfolioStyles.label}>Select Bank:</Text>
        <View style={{ marginVertical: 10 }}>
          <TouchableOpacity
            style={[
              styles.dropdownButton,
              component && { borderColor: "#4A6FA5" },
            ]}
            onPress={() => setSelectionModalVisible(true)}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              {component && (
                <View
                  style={[
                    styles.platformIcon,
                    {
                      backgroundColor: PORTFOLIO_COLORS[0],
                      width: 24,
                      height: 24,
                      marginRight: 10,
                    },
                  ]}
                >
                  <Text style={styles.platformIconText}>
                    {component.charAt(0)}
                  </Text>
                </View>
              )}
              <Text
                style={[
                  styles.dropdownButtonText,
                  !component && { color: "#888" },
                ]}
              >
                {component || "Choose a Portfolio!"}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={selectionModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSelectionModalVisible(false)}
      >
        <View style={styles.bankModalContainer}>
          <View style={styles.bankModalContent}>
            <View style={styles.bankModalHeader}>
              <Text style={styles.bankModalTitle}>Select Bank</Text>
              <TouchableOpacity
                onPress={() => setSelectionModalVisible(false)}
                style={styles.bankModalCloseButton}
              >
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            {
              <ScrollView style={styles.bankModalList}>
                {availComponents.length > 0 ? (
                  availComponents.map((item) => (
                    <TouchableOpacity
                      key={item}
                      onPress={() => {
                        setComponent(item);
                        setSelectionModalVisible(false);
                      }}
                      style={[
                        styles.bankModalItem,
                        component === item && styles.bankModalItemSelected,
                      ]}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <View
                          style={[
                            styles.platformIcon,
                            {
                              backgroundColor: PORTFOLIO_COLORS[0],
                              width: 24,
                              height: 24,
                              marginRight: 10,
                            },
                          ]}
                        >
                          <Text style={styles.platformIconText}>
                            {item.charAt(0)}
                          </Text>
                        </View>
                        <Text
                          style={[
                            styles.bankModalItemText,
                            component === item &&
                              styles.dropdownItemTextSelected,
                          ]}
                        >
                          {item}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text
                    style={{
                      textAlign: "center",
                      padding: 20,
                      color: "#888",
                    }}
                  >
                    No banks available
                  </Text>
                )}
              </ScrollView>
            }
          </View>
        </View>
      </Modal>
    </>
  );
}
