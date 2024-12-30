import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, RotateCcw } from "lucide-react";

interface ColorPalette {
  [key: string]: string;
}

const DEFAULT_PALETTE: ColorPalette = {
  "palette-0": "#51576d",
  "palette-1": "#e78284",
  "palette-2": "#a6d189",
  "palette-3": "#e5c890",
  "palette-4": "#8caaee",
  "palette-5": "#f4b8e4",
  "palette-6": "#81c8be",
  "palette-7": "#a5adce",
  "palette-8": "#626880",
  "palette-9": "#e67172",
  "palette-10": "#8ec772",
  "palette-11": "#d9ba73",
  "palette-12": "#7b9ef0",
  "palette-13": "#f2a4db",
  "palette-14": "#5abfb5",
  "palette-15": "#b5bfe2",
  background: "#303446",
  foreground: "#c6d0f5",
  "cursor-color": "#f2d5cf",
  "selection-background": "#626880",
  "selection-foreground": "#c6d0f5",
};

const ColorPicker: React.FC<{
  color: string;
  onChange: (color: string) => void;
  label: string;
}> = ({ color, onChange, label }) => {
  return (
    <div className="mb-2 flex items-center gap-2">
      <input
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-8 cursor-pointer rounded"
      />
      <span className="text-sm">{label}</span>
    </div>
  );
};

const CodePreview: React.FC<{ palette: ColorPalette }> = ({ palette }) => {
  return (
    <div
      className="rounded-lg p-4"
      style={{ backgroundColor: palette["background"] }}
    >
      <pre
        className="font-mono text-sm"
        style={{ color: palette["foreground"] }}
      >
        <span style={{ color: palette["palette-1"] }}>function</span>{" "}
        <span style={{ color: palette["palette-4"] }}>example</span>
        <span style={{ color: palette["palette-7"] }}>() {"{}"}</span>
        {"\n"}
        <span style={{ color: palette["palette-2"] }}>
          // This is a comment
        </span>
        {"\n"}
        <span style={{ color: palette["palette-5"] }}>const</span>{" "}
        <span style={{ color: palette["palette-6"] }}>variable</span>{" "}
        <span style={{ color: palette["palette-7"] }}>=</span>{" "}
        <span style={{ color: palette["palette-3"] }}>"string"</span>;
      </pre>
    </div>
  );
};

const ThemeEditor = () => {
  const [palette, setPalette] = useState<ColorPalette>(DEFAULT_PALETTE);

  useEffect(() => {
    const savedPalette = localStorage.getItem("colorPalette");
    if (savedPalette) {
      setPalette(JSON.parse(savedPalette));
    }
  }, []);

  const handleColorChange = (key: string, color: string) => {
    const newPalette = { ...palette, [key]: color };
    setPalette(newPalette);
    localStorage.setItem("colorPalette", JSON.stringify(newPalette));
  };

  const resetColors = () => {
    setPalette(DEFAULT_PALETTE);
    localStorage.setItem("colorPalette", JSON.stringify(DEFAULT_PALETTE));
  };

  const exportTheme = () => {
    let content = "";
    Object.entries(palette).forEach(([key, value]) => {
      if (key.startsWith("palette-")) {
        const index = key.split("-")[1];
        content += `palette = ${index}=#${value.substring(1)}\n`;
      } else {
        content += `${key} = ${value.substring(1)}\n`;
      }
    });

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "theme.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Ghostty Themes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold">Basic Colors</h3>
            <div className="space-y-2">
              <ColorPicker
                color={palette["background"]}
                onChange={(color) => handleColorChange("background", color)}
                label="Background"
              />
              <ColorPicker
                color={palette["foreground"]}
                onChange={(color) => handleColorChange("foreground", color)}
                label="Foreground"
              />
              <ColorPicker
                color={palette["cursor-color"]}
                onChange={(color) => handleColorChange("cursor-color", color)}
                label="Cursor"
              />
              <ColorPicker
                color={palette["selection-background"]}
                onChange={(color) =>
                  handleColorChange("selection-background", color)
                }
                label="Selection Background"
              />
              <ColorPicker
                color={palette["selection-foreground"]}
                onChange={(color) =>
                  handleColorChange("selection-foreground", color)
                }
                label="Selection Foreground"
              />
            </div>

            <h3 className="mb-4 mt-6 text-lg font-semibold">Palette Colors</h3>
            <div className="grid grid-cols-2 gap-2">
              {Array.from({ length: 16 }).map((_, i) => (
                <ColorPicker
                  key={i}
                  color={palette[`palette-${i}`]}
                  onChange={(color) => handleColorChange(`palette-${i}`, color)}
                  label={`Color ${i}`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="mb-4 text-lg font-semibold">Preview</h3>
            <CodePreview palette={palette} />

            <div className="mt-6 flex gap-4">
              <Button
                onClick={resetColors}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Colors
              </Button>
              <Button onClick={exportTheme} className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Theme
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ThemeEditor;
