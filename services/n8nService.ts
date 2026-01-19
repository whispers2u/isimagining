
import { AspectRatio } from "../types";

export const generateImageWithN8n = async (
  webhookUrl: string, 
  prompt: string, 
  aspectRatio: AspectRatio
): Promise<string> => {
  if (!webhookUrl) {
    throw new Error("URL Webhook n8n non configurée.");
  }

  try {
    console.log("🚀 [n8n] Envoi du prompt:", prompt);
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        aspectRatio,
        timestamp: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Erreur n8n (${response.status}): ${errorText}`);
    }

    const textResponse = await response.text();
    console.log("📦 [n8n] Réponse brute reçue:", textResponse);

    // 1. Test : La réponse est-elle directement une URL ?
    const possibleUrl = textResponse.trim().replace(/^["']|["']$/g, '');
    if (possibleUrl.startsWith('http')) {
      console.log("✅ [n8n] URL détectée en texte brut");
      return possibleUrl;
    }

    // 2. Test : Est-ce du JSON ?
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (e) {
      throw new Error("La réponse n8n n'est ni une URL valide ni un JSON valide.");
    }

    let foundUrl = "";

    // Fonction de recherche ultra-résiliente
    const findImageLink = (obj: any): void => {
      if (!obj || foundUrl) return;

      // Si c'est une chaîne, est-ce une URL ?
      if (typeof obj === 'string') {
        const s = obj.trim();
        if (s.startsWith('http') && (s.includes('.png') || s.includes('.jpg') || s.includes('.jpeg') || s.includes('X-Amz-Signature'))) {
          foundUrl = s;
        }
        return;
      }

      // Si c'est un tableau, on cherche dans chaque case
      if (Array.isArray(obj)) {
        for (const item of obj) {
          findImageLink(item);
          if (foundUrl) break;
        }
        return;
      }

      // Si c'est un objet, on cherche les clés connues en priorité
      if (typeof obj === 'object') {
        const priorityKeys = ['result_url', 'imageUrl', 'url', 'result', 'data', 'output'];
        for (const key of priorityKeys) {
          const val = obj[key];
          if (typeof val === 'string' && val.startsWith('http')) {
            foundUrl = val;
            return;
          }
        }

        // Sinon on fouille tout l'objet récursivement
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            findImageLink(obj[key]);
            if (foundUrl) break;
          }
        }
      }
    };

    findImageLink(data);

    if (foundUrl) {
      console.log("✅ [n8n] URL extraite avec succès:", foundUrl);
      return foundUrl;
    }

    // 3. Backup : Preview Base64 ?
    const findPreview = (obj: any): string | null => {
      if (!obj) return null;
      if (typeof obj === 'object') {
        if (obj.preview && typeof obj.preview === 'string') return obj.preview;
        for (const k in obj) {
          const res = findPreview(obj[k]);
          if (res) return res;
        }
      }
      return null;
    };

    const preview = findPreview(data);
    if (preview) {
      console.log("⚠️ [n8n] URL introuvable, utilisation du preview Base64.");
      return preview.startsWith('data:') ? preview : `data:image/png;base64,${preview}`;
    }

    throw new Error("Impossible de trouver une URL d'image ou un aperçu dans la réponse n8n.");
  } catch (error: any) {
    console.error("❌ [n8n] Erreur service:", error);
    throw new Error(error.message || "Erreur inconnue lors de l'appel n8n.");
  }
};
