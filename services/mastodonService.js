const fetch = require("node-fetch");
const MastodonUser = require("../models/mastodonUserModel");

const clientId = process.env.YOUR_CLIENT_ID;
const clientSecret = process.env.YOUR_CLIENT_SECRET;
const redirectUri = process.env.REDIRECT_URL;
const mastodonUrl = process.env.MASTODON_URL;

// Paso 1: Obtener el token de acceso usando el código de autorización
async function getAccessToken(authorizationCode) {
  try {
    const formBody = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: authorizationCode,
      grant_type: "authorization_code",
    });

    const response = await fetch(`${mastodonUrl}/oauth/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formBody.toString(),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener el token de acceso:", error.message);
    throw error;
  }
}

async function postStatus(userId, status) {
  try {
    const mastodonUser = await MastodonUser.findOne({ where: { userId } });
    if (!mastodonUser) {
      throw new Error("User not found");
    }

    const response = await fetch(`${mastodonUrl}/api/v1/statuses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${mastodonUser.accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        status,
        visibility: "public",
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    // console.log("Post publicado exitosamente:", data);
    return { success: true, response: data };
  } catch (error) {
    console.error("Error al publicar el post:", error.message);
    return { success: false };
  }
}

module.exports = {
  getAccessToken,
  postStatus,
};
