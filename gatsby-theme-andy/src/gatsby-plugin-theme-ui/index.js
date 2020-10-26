import "./style.css"
export default {
	colors: {
		text: "#333",
		heading: "#660000",
		"text-light": "#718096",
		background: "#FCF6E1",
		primary: "#3182ce",
		links: "#3182ce",
		gray: "#dadada",
		accent: "#f0ebda",
	},
	breakpoints: ["640px", "768px", "1024px", "1280px"],
	space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
	borders: [0, 1, 2, 3, 4],
	radii: [0, 4, 8, 16, 32, 64, 128, 256, 512],
	fonts: {
		body: "'Lora', serif, Microsoft YaHei",
		headingBig: "'IM Fell English SC', serif, Microsoft YaHei",
		headingSmall: "'Alegreya', serif, Microsoft YaHei",
		monospace: "Menlo, monospace, Microsoft YaHei",
	},
	fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
	fontWeights: {
		body: 400,
		heading: 700,
		bold: 700,
		blockquote: 700,
	},
	lineHeights: {
		body: 1.5,
		heading: 1.125,
	},
	links: {
		internal: {
			color: "links",
			px: "2px",
			mx: "-2px",
			borderRadius: 1,
			":hover": {
				bg: "accent",
			},
			":focus": {
				bg: "accent",
			},
		},
	},
	styles: {
		root: {
			fontFamily: "body",
			lineHeight: "body",
			fontWeight: "body",
			backgroundColor: "background",
		},
		h1: {
			color: "heading",
			fontFamily: "headingBig",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 5,
		},
		h2: {
			color: "heading",
			fontFamily: "headingSmall",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 4,
		},
		h3: {
			color: "heading",
			fontFamily: "headingSmall",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 3,
		},
		h4: {
			color: "heading",
			fontFamily: "headingSmall",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 2,
		},
		h5: {
			color: "heading",
			fontFamily: "headingSmall",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 1,
		},
		h6: {
			color: "heading",
			fontFamily: "headingSmall",
			lineHeight: "heading",
			fontWeight: "heading",
			fontSize: 0,
		},
		p: {
			color: "text",
		},
		a: {
			color: "links",
			textDecoration: "none",
			":hover": {
				textDecoration: "underline",
			},
		},
		blockquote: {
			fontSize: 3,
			lineHeight: "heading",
			fontWeight: "blockquote",
		},
		pre: {
			fontFamily: "monospace",
			overflowX: "auto",
			code: {
				color: "inherit",
			},
		},
		code: {
			fontFamily: "monospace",
			fontSize: "inherit",
		},
		table: {
			width: "100%",
			borderCollapse: "separate",
			borderSpacing: 0,
		},
		th: {
			textAlign: "left",
			borderBottomStyle: "solid",
		},
		td: {
			textAlign: "left",
			borderBottomStyle: "solid",
		},
		img: {
			maxWidth: "100%",
		},
	},
};
