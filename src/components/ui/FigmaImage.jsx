import { useState, useEffect } from "react";
import axios from "axios";
import { Figma } from "lucide-react";

const FIGMA_TOKEN = import.meta.env.VITE_FIGMA_TOKEN;

export function FigmaImage({ fileId, nodeId }) {
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!fileId || !nodeId) {
      setError("Figma 파일 및 노드 정보가 필요합니다.");
      return;
    }

    const fetchImage = async () => {
      try {
        const response = await axios.get(
          `https://api.figma.com/v1/images/${fileId}`,
          {
            headers: {
              "X-Figma-Token": FIGMA_TOKEN,
            },
            params: {
              ids: nodeId,
              format: "png",
              scale: 2,
            },
          }
        );

        if (response.data.err) {
          throw new Error(response.data.err);
        }

        const url = response.data.images[nodeId];
        if (url) {
          setImageUrl(url);
        } else {
          throw new Error("Figma API 응답에서 이미지 URL을 찾을 수 없습니다.");
        }
      } catch (err) {
        console.error("Figma API fetch error:", err);
        setError(`Figma 이미지를 불러오는 데 실패했습니다: ${err.message}`);
      }
    };

    fetchImage();
  }, [fileId, nodeId]);

  if (error) {
    return (
      <div className="w-full h-full bg-destructive/10 rounded-lg flex items-center justify-center p-4">
        <p className="text-sm text-destructive text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={`Figma design for node ${nodeId}`}
          style={{ maxWidth: "100%" }}
        />
      ) : (
        <div className="text-center space-y-2 text-muted-foreground">
          <Figma className="w-10 h-10 mx-auto animate-pulse" />
          <p className="text-sm">Figma 디자인 로딩 중...</p>
        </div>
      )}
    </div>
  );
}

{
  /* <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <div className="text-center space-y-2">
                <Figma className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Figma 디자인 미리보기
                </p>
                <p className="text-xs text-muted-foreground">
                  마지막 업데이트: {screenData.lastUpdated}
                </p>
              </div>
            </div> */
}
