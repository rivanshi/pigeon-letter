const mainBtn = document.getElementById("mainBtn");
const saveBtn = document.getElementById("saveBtn");
const editActions = document.getElementById("editActions");
const postActions = document.getElementById("postActions");
const addKissBtn = document.getElementById("addKissBtn");

const title = document.getElementById("title");
const body = document.getElementById("body");
const signature = document.getElementById("signature");

const widgetsLayer = document.getElementById("widgets-layer");
const stage = document.querySelector(".stage");

const downloadBtn = document.getElementById("downloadBtn");
const copyLinkBtn = document.getElementById("copyLinkBtn");

let isEditing = false;

/* =========================
   EDIT MODE
========================= */
mainBtn.onclick = () => {
  isEditing = true;
  mainBtn.classList.add("hidden");
  editActions.classList.remove("hidden");
  postActions.classList.add("hidden");

  [title, body, signature].forEach(el => {
    el.contentEditable = true;
    el.innerText = "Write your message here...";
  });
};

/* =========================
   SAVE
========================= */
saveBtn.onclick = () => {
  isEditing = false;
  editActions.classList.add("hidden");
  mainBtn.classList.remove("hidden");
  postActions.classList.remove("hidden");

  [title, body, signature].forEach(el => el.contentEditable = false);
};

/* =========================
   ADD KISS MARK
========================= */
addKissBtn.onclick = () => {
  if (!isEditing) return;

  const kiss = document.createElement("img");
  kiss.src = "kiss.png";
  kiss.crossOrigin = "anonymous";
  kiss.className = "kiss-widget";
  kiss.style.left = "320px";
  kiss.style.top = "220px";
  kiss.dataset.scale = 1;
  kiss.dataset.rotate = 0;

  widgetsLayer.appendChild(kiss);
  enableDrag(kiss);
};

function enableDrag(el) {
  let dragging = false;
  let offsetX, offsetY;

  el.onmousedown = (e) => {
    dragging = true;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
  };

  document.onmousemove = (e) => {
    if (!dragging) return;
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
  };

  document.onmouseup = () => dragging = false;

  el.onwheel = (e) => {
    e.preventDefault();
    let scale = parseFloat(el.dataset.scale);
    scale += e.deltaY * -0.001;
    scale = Math.min(Math.max(scale, 0.4), 2);
    el.dataset.scale = scale;
    el.style.transform =
      `rotate(${el.dataset.rotate}deg) scale(${scale})`;
  };

  el.ondblclick = () => {
    let rotate = parseFloat(el.dataset.rotate) + 15;
    el.dataset.rotate = rotate;
    el.style.transform =
      `rotate(${rotate}deg) scale(${el.dataset.scale})`;
  };
}

/* =========================
   DOWNLOAD (FIXED)
========================= */
downloadBtn.onclick = async () => {
  const canvas = await html2canvas(stage, {
    backgroundColor: "#f7f0e6",
    scale: 2,
    useCORS: true,
    allowTaint: false
  });

  const link = document.createElement("a");
  link.download = "my-letter.png";
  link.href = canvas.toDataURL("image/png");
  link.click();
};

/* =========================
   COPY LINK (ROBUST)
========================= */
copyLinkBtn.onclick = async () => {
  const params = new URLSearchParams({
    title: title.innerText,
    body: body.innerText,
    signature: signature.innerText
  });

  const shareURL =
    window.location.origin +
    window.location.pathname +
    "?" +
    params.toString();

  try {
    await navigator.clipboard.writeText(shareURL);
    alert("Link copied!");
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = shareURL;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Link copied!");
  }
};