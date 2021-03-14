const capitalizeFirstLetter = (string: string): string => string
  .toLowerCase()
  .split(" ")
  .map((word) => word[0].toUpperCase() + word.substr(1))
  .join(" ");

export default capitalizeFirstLetter;
