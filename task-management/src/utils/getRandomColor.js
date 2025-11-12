export const getRandomLightColor = () => {
	const lightColors = [
		"#e9d5ff",
		"#bae6fd",
		"#bfdbfe",
		"#c7d2fe",
		"#E1E9C9",
		"#FEEBF6",
		"#F4F8D3",
		
		"#FFEDFA",
		
		"#EDE8DC",
		
		"#FEFAE0",
		"#FFEAA7",
		"#F5EEE6",

		"#EADCF8",
		"#d7eaf3",
		"#fadadd",
		"#dff6e6",
		"#ffe8d6",
		"#e3f2fd",
		"#f3e5f5",
		"#fff8e7",
		"#fce4ce",
		"#e0f7fa",
	];
	return lightColors[Math.floor(Math.random() * lightColors.length)];
};
