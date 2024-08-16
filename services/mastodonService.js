const MastodonUser = require("../models/mastodonUserModel");

const {
  MASTODON_CLIENT_ID,
  MASTODON_CLIENT_SECRET,
  MASTODON_REDIRECT_URL,
  MASTODON_URL,
} = process.env;

// Paso 1: Obtener el token de acceso usando el código de autorización
async function getAccessToken(authorizationCode) {
  try {
    const formBody = new URLSearchParams({
      client_id: MASTODON_CLIENT_ID,
      client_secret: MASTODON_CLIENT_SECRET,
      redirect_uri:  MASTODON_REDIRECT_URL,
      code: authorizationCode,
      grant_type: "authorization_code",
    });

    const response = await fetch(`${MASTODON_URL}/oauth/token`, {
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
    const mastodonUser = await MastodonUser.findOne({
      where: { userId, state: "Activated" },
    });
    if (!mastodonUser) {
      throw new Error("User not found");
    }

    const response = await fetch(`${MASTODON_URL}/api/v1/statuses`, {
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
    await MastodonUser.update(
      {
        state: "Expired",
      },
      { where: { userId } }
    );
    return { success: false };
  }
}

module.exports = {
  getAccessToken,
  postStatus,
};
