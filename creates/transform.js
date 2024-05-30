const perform = async (z, bundle) => {
	imagetobeTransformed = "";
	if (bundle.inputData.url.includes("https://cdn.pixelbinz0.de")) {
		imagetobeTransformed = bundle.inputData.url;
	} else {
		try {
			const response = await z.request({
				url: `https://api.pixelbinz0.de/service/platform/assets/v1.0/upload/url`,
				method: "POST",
				headers: {
					accept: "application/json",
					"Content-Type": "application/json",
					// Add more headers as required
				},
				body: JSON.stringify({
					url: bundle.inputData.url,
					path: "/__zapier_Transfomation",
					tags: bundle.inputData.tags,
					// Assuming filename is static as per your example
					access: "public-read", // Assuming access is static as per your example
					metadata: {}, // Assuming metadata is empty as per your example
					overwrite: true, // Use provided value or default to false
					filenameOverride: true,
				}),
			});
			imagetobeTransformed = response.data.url;
		} catch (error) {
			throw new Error(`FAILED to upload image: ${error}`);
		}
	}

	let replacement = "sr.upscale(";
	if (bundle.inputData.t) replacement += `t:${bundle.inputData.t},`;
	if (bundle.inputData.enhance_face)
		replacement += `enhance_face:${bundle.inputData.enhance_face},`;
	if (bundle.inputData.model) replacement += `model:${bundle.inputData.model},`;
	if (bundle.inputData.enhance_quality)
		replacement += `enhance_quality:${bundle.inputData.enhance_quality},`;

	replacement += ")";

	imagetobeTransformed = imagetobeTransformed.replace("original", replacement);
	return { url: imagetobeTransformed };
};

module.exports = {
	key: "transform",
	noun: "transform",

	display: {
		label: "Upscale Images",
		description: "Creates a PixeBin.io URL of an upscaled image.",
	},

	operation: {
		perform,
		inputFields: [
			{
				key: "url",
				required: true,
				type: "string",
				helpText:
					"URL of the image to upload.(upto resolution 1,500 x 1,500 px)",
			},
			{
				key: "t",
				label: "Type",
				required: false,
				choices: ["2x", "4x", "8x"],
				type: "string",
			},
			{
				key: "enhance_face",
				label: "Enahnace Face",
				required: false,
				type: "boolean",
			},

			{
				key: "model",
				label: "Model",
				required: false,
				choices: ["Picasso", "Flash"],
				type: "string",
			},
			{
				key: "enhance_quality",
				label: "Enhance Quality",
				required: false,
				type: "boolean",
			},
		],
	},
};
