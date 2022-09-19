import { validator } from "@ioc:Adonis/Core/Validator";

validator.rule("iFrameLink", (value, _, options) => {
  if (typeof value !== "string") {
    return;
  }
  let error: boolean = false;

  const isYoutube = value.toLowerCase().includes("youtube.com");
  const isRutube = value.toLowerCase().includes("rutube.ru");
  if (!isYoutube && !isRutube) error = true;

  if (isYoutube) {
    if (!value.toLowerCase().startsWith("https://www.youtube.com/watch?v")) {
      error = true;
    }
  }

  if (isRutube) {
    if (!value.toLowerCase().startsWith("https://rutube.ru/video/")) {
      error = true;
    }
  }

  const correntFormat = isRutube
    ? "https://rutube.ru/video/12345abcd..."
    : "https://www.youtube.com/watch?v=12345abcd...";

  if (error) {
    options.errorReporter.report(
      options.pointer,
      "iFrameLink",
      `Вставьте ссылку корректного формата: ${correntFormat}`,
      options.arrayExpressionPointer
    );
  }

  return;
});
