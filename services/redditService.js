const RedditUser = require("../models/redditUserModel");

const {
  REDDIT_CLIENT_ID,
  REDDIT_CLIENT_SECRET,
  REDDIT_REDIRECT_URL,
  REDDIT_URL,
} = process.env;

// Paso 1: Obtener el token de acceso usando el código de autorización

async function getAccessToken(authorizationCode) {
  const response = await fetch(`${REDDIT_URL}/api/v1/access_token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(
        `${REDDIT_CLIENT_ID}:${REDDIT_CLIENT_SECRET}`
      ).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: authorizationCode,
      redirect_uri: REDDIT_REDIRECT_URL,
    }),
  });

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    console.error("Error getting access token:", data);
    throw new Error("Failed to get access token");
  }
}

async function postStatus(userId, title, text, sr) {
  try {
    const redditUser = await RedditUser.findOne({
      where: { userId, state: "Activated" },
    });
    if (!redditUser) {
      throw new Error("User not found");
    }

    const response = await fetch("https://oauth.reddit.com/api/submit", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redditUser.accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        sr: sr ?? "test",
        title,
        kind: "self",
        text,
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
    await RedditUser.update(
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
