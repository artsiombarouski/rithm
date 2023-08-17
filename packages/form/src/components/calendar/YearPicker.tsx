import { range } from './utils';
import { Pressable, useTheme, Text } from 'native-base';
import * as React from 'react';
import { FlatList, StyleSheet, View, ScrollView } from 'react-native';

const ITEM_HEIGHT = 62;

export default function YearPicker({
  selectedYear,
  selectingYear,
  onPressYear,
  startYear,
  endYear,
}: {
  selectedYear: number | undefined;
  selectingYear: boolean;
  onPressYear: (year: number) => any;
  startYear: number;
  endYear: number;
}) {
  const flatList = React.useRef<FlatList<number> | null>(null);
  const years = range(
    isNaN(startYear) ? 1950 : startYear,
    isNaN(endYear) ? 2050 : endYear,
  );

  // scroll to selected year
  React.useEffect(() => {
    if (flatList.current && selectedYear && selectingYear) {
      const indexToGo = selectedYear - startYear;
      flatList.current.scrollToOffset({
        offset: (indexToGo / 3) * ITEM_HEIGHT - ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [flatList, selectedYear, startYear, selectingYear]);
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        styles.root,
        selectingYear ? styles.opacity1 : styles.opacity0,
      ]}
      pointerEvents={selectingYear ? 'auto' : 'none'}
    >
      <FlatList<number>
        ref={flatList}
        style={styles.list}
        data={years}
        renderScrollComponent={(sProps) => {
          return <ScrollView {...sProps} />;
        }}
        renderItem={({ item }) => (
          <Year
            year={item}
            selected={selectedYear === item}
            onPressYear={onPressYear}
          />
        )}
        keyExtractor={(item) => `${item}`}
        numColumns={3}
      />
    </View>
  );
}

function YearPure({
  year,
  selected,
  onPressYear,
}: {
  year: number;
  selected: boolean;
  onPressYear: (newYear: number) => any;
}) {
  const theme = useTheme();

  return (
    <View style={styles.year}>
      <Pressable
        onPress={() => onPressYear(year)}
        accessibilityRole="button"
        accessibilityLabel={String(year)}
        style={styles.yearButton}
      >
        <View
          style={[
            styles.yearInner,
            selected ? { backgroundColor: theme.colors.primary['500'] } : null,
          ]}
        >
          <Text
            fontSize={'md'}
            color={selected ? 'white' : 'black'}
            selectable={false}
          >
            {year}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
const Year = React.memo(YearPure);

const styles = StyleSheet.create({
  root: {
    flex: 1,
    top: 56,
    zIndex: 100,
    backgroundColor: 'white',
  },
  list: {
    flex: 1,
  },
  year: {
    flex: 1,
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  yearButton: {
    borderRadius: 46 / 4,
    overflow: 'hidden',
    alignItems: 'center',
  },
  yearInner: {
    borderRadius: 46 / 4,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 100,
    width: '100%',
  },
  opacity0: {
    opacity: 0,
  },
  opacity1: {
    opacity: 1,
  },
});
