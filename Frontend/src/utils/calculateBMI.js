export const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;

  const bmi =
    weight /
    (heightInMeters * heightInMeters);

  return bmi.toFixed(1);
};

export const getBMIStatus = (bmi) => {
  if (bmi < 18.5) {
    return "Underweight";
  }

  if (bmi < 25) {
    return "Normal";
  }

  if (bmi < 30) {
    return "Overweight";
  }

  return "Obese";
};