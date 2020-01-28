/* global canvas createDropdownCol */
const dropdownElements = [['info dropdown-toggle', '', 'c', 'palette', '<span id="change-color-text"><u>C</u>hange color</span>'], 'change-color', [['14', 'Custom color <input type="color" value="#ff0000" id="customColor" />'], ['15', 'Random (same color for each line)'], ['16', 'Random (different color for each line)'], ['17', 'Random (change colors in each shift)']]];
const dropdownCol = createDropdownCol(...dropdownElements);
dropdownCol.className += ' btn-group-center';
document.getElementById('background').insertBefore(dropdownCol, canvas);
dropdownCol.children[1].children[0].id = 'custom';
