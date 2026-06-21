export function optimizeImage(url, width = 900) {
  if (!url) return "/hero.jpg";

  if (!url.includes("res.cloudinary.com")) {
    return url;
  }

  return url.replace("/upload/", `/upload/f_auto,q_auto,w_${width}/`);
}
