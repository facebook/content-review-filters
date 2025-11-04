# Content Review Filters

This repository contains a collection of React components to enable developers to integrate content filters and settings in content review tools.

These components support the following image and video filters:

- Blur
- Black & White
- Sepia (i.e. yellow tint)
- Transparency
- Reduced detail (i.e. make the content appear like an illustration)
- Warning screens (i.e. show a warning if content is predicted to be graphic)

Note: the reduced detail filter uses WebGL to apply shaders to images or videos to make them appear as an illustration.The warning screen filter requires integration of your own AI model for content detection - you can build your own model, write a prompt for an LLM, or use an off-the-shelf solution from Trust & Safety or image recognition/Content Understanding AI vendors.

Additionally, this repository provides a custom video player that allows users to set preferences for default playback speed, to skip forwards and backwards in a video, and to adjust the default audio volume.

## Security Considerations

When integrating these content review filters into production systems, please keep the following security considerations in mind:

### AI Model Integration and Content Detection

If you're using the warning screen filter with AI-based content detection:

- **Validate AI Model Outputs**: Always validate and sanitize outputs from AI models before using them to generate warnings or labels. AI models can produce unexpected or malicious outputs.
- **Human Oversight is Critical**: Do not rely solely on AI predictions for content moderation. AI models have limitations and can produce false positives and false negatives. Implement human review processes, especially for high-stakes moderation decisions.
- **Defense in Depth**: Use multiple layers of content detection (e.g., hashing for known bad content, AI for novel content, human review for edge cases) rather than relying on a single system.
- **Model Poisoning Risks**: Be aware that AI models can be manipulated through adversarial examples or poisoned training data. Regularly audit your models and their outputs.
- **Privacy Considerations**: Ensure that any AI model integration complies with privacy regulations (GDPR, CCPA, etc.) and that user content is handled appropriately.

### User Input Sanitization

The components in this library accept user-provided inputs that are displayed to users:

- **Caption Text**: The `caption` prop can contain user-generated text that will be displayed on warning screens. If this text comes from untrusted sources (e.g., user input, external APIs), you should sanitize it to prevent the display of misleading or malicious messages. While React provides XSS protection by default, semantic attacks (displaying misleading information that appears to come from your application) are still possible.
- **Harm Type Labels**: The `harmType` prop is used to generate warning messages (e.g., "Possible {harmType}"). Ensure this value comes from a controlled set of labels in your application, not directly from user input or untrusted sources.
- **Length Limits**: Consider implementing maximum length limits for caption text to prevent UI abuse and ensure good user experience.

### Content Security Policy (CSP)

When using these filters with images and videos from external sources:

- **Validate Media Sources**: If loading media from user-provided URLs, validate that URLs come from trusted domains and implement appropriate CSP headers.
- **WebGL Context**: The reduced detail filter uses WebGL, which can be a target for certain types of attacks. Ensure WebGL is necessary for your use case and implement appropriate security measures.
- **CORS Configuration**: Properly configure CORS headers when loading media from different origins to prevent unauthorized access.

### LocalStorage Security

The preference management system uses browser localStorage:

- **User-Controlled Data**: Remember that localStorage can be modified by users with browser developer tools. Do not store security-critical data in localStorage.
- **XSS Vulnerability**: If your application has XSS vulnerabilities, attackers can access localStorage data. Implement proper input sanitization and Content Security Policy to prevent XSS.
- **Per-Domain Storage**: localStorage is per-domain, so preferences are isolated between different domains but shared across all pages of the same domain.

There are multiple ways of integrating these components into your own tool, depending on how much customization you would like:

- Option A (easiest, least customizable): use provided `ContentFilteredImage` and `ContentFilteredVideo` components to render your image/video, with out-of-the box controls.
- Option B (harder, more customizable): use `ContentFilteredImageWrapper` and `ContentFilteredVideoWrapper` to wrap an HTML `img` or `video` tag within your own custom image viewer or video player. Use `ContentFilterContextProvider` to write the state of each filter (enabled/disabled), which will then be read by the aforementioned wrapper components to apply the filters. We provide each control button from Option A as a separate component, allowing you to arrange these as you need or to override styles and icons to fit the theme of your application.

In addition to the filters described above, this repository includes:

- An example settings menu component for users to configure the preferences. By default, this writes to local storage in the browser, enabling you to integrate this easily without having to make server side changes. For settings to persist across devices, we recommend syncing this state with a server-side database.

While this repository only contains React implementations of these filters, we welcome contributions of equivalent components for other web frameworks. We also welcome other contributions to continue to improve these tools.

## Reduced Detail Filter

Files in the reduced_detail directory are adapted from the Reducing Affective Responses to Surgical Images and Videos Through Stylization paper, with some relevant modifications to make it work in the context of a React app.

Citation: Lonni Besançon, Amir Semmo, David Biau, Bruno Frachet, Virginie Pineau, et al.. Reducing Affective Responses to Surgical Images and Videos Through Stylization. Computer Graphics Forum, Wiley, In press, 39, ff10.1111/cgf.13886ff. ffhal-02381513v2ff

They were published in this GitHub repo with Apache license: https://github.com/lonnibesancon/Arkangel

You can find the original paper here: https://inria.hal.science/hal-02381513/file/besancon-surgery-inpress.pdf

And a TedX talk about the project here: https://www.youtube.com/watch?v=pDHomZ8FEoU

# License

Content Review Filteres is Apache-2 licensed, as found in the [LICENSE](/LICENSE) file.
