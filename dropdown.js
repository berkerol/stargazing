/* global canvas createDropdownRow */
const dropdownElements = [[['info dropdown-toggle', '', 'c', 'palette', '<span id="change-color-text"><u>C</u>hange color</span>'], 'change-color', [['14', 'Custom color <input type="color" value="#ff0000" id="customColor" />'], ['15', 'Random (same color for each line)'], ['16', 'Random (different color for each line)'], ['17', 'Random (change colors in each shift)']]]];
const dropdownRow = createDropdownRow(dropdownElements);
document.body.insertBefore(dropdownRow, canvas);
dropdownRow.children[0].children[1].children[0].id = 'custom';
