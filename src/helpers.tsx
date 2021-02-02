export const capitalizeFirstLetter = (string: string): string => {
  return string
    .toLowerCase()
    .split(' ')
    .map(word => {
        return word[0].toUpperCase() + word.substr(1);
    })
    .join(' ');
};
