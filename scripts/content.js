const body = document.querySelector("body");

const link = document.createElement('link');
link.href = 'https://fonts.googleapis.com/css2?family=Pangolin&display=swap';
link.rel = 'stylesheet';
document.head.appendChild(link);

function createFloatingWindow() {
    const floatingWindow = document.createElement("div");
    floatingWindow.className = 'floating-window';
    floatingWindow.style.cssText = `
    position: fixed;
    top: 20px;
    left: 20px;
    width: 700px;
    height: 450px;
    background: rgba(255, 255, 255, 0.2);
    backdrop-filter: blur(15px);
    border: 1px solid #ccc;
    border-radius: 20px;
    z-index: 10000;
    display: block;
    font-family: 'Pangolin', cursive;
  `;

    const header = document.createElement("div");
    header.style.cssText = `
    padding: 10px;
    color: #FFFDD4;
    background: #FF7676;
    border-bottom: 1px solid #ccc;
    border-radius: 20px 20px 0 0;
    cursor: move;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `;
    header.innerHTML = `
    <span>Dodo Sketch</span>
    <button style="cursor:pointer;border:none;background:none;font-size:20px;color:#FFFDD4;">×</button>
  `;

    const content = document.createElement("div");
    content.style.cssText = `
    padding: 10px;
    font-family: 'Pangolin', cursive;
    flex: 1;
    overflow: auto;
  `;

    const editableArea = document.createElement('div');
    editableArea.id = 'interface';
    editableArea.contentEditable = 'true';
    editableArea.style.cssText = `
    width: 100%;
    height: 380px;
    border: none;
    outline: none;
    background: transparent;
    font-size: 16px;
    mix-blend-mode: difference;
    font-family: inherit;
    resize: none;
    border: 1px dashed #ccc;
    padding: 16px;
  `;
    content.appendChild(editableArea);

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'file-input';
    fileInput.multiple = true;
    fileInput.hidden = true;
    
    floatingWindow.appendChild(header);
    floatingWindow.appendChild(content);
    floatingWindow.appendChild(fileInput);

    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;

    header.addEventListener("mousedown", (e) => {
        body.style.userSelect = 'none';
        isDragging = true;
        initialX = e.clientX - floatingWindow.offsetLeft;
        initialY = e.clientY - floatingWindow.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
        if (isDragging) {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            floatingWindow.style.left = currentX + "px";
            floatingWindow.style.top = currentY + "px";
        }
    });

    document.addEventListener("mouseup", () => {
        body.style.userSelect = 'auto';
        isDragging = false;
    });

    header.querySelector('button').addEventListener('click', () => {
        floatingWindow.style.display = 'none';
    });

    body.appendChild(floatingWindow);

    const dropArea = floatingWindow.querySelector('#interface');
    const file = floatingWindow.querySelector('#file-input');

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    dropArea.addEventListener('dragover', preventDefaults);
    dropArea.addEventListener('dragenter', preventDefaults);
    dropArea.addEventListener('dragleave', preventDefaults);
    dropArea.addEventListener('drop', handleDrop);

    function handleDrop(e) {
        e.preventDefault();
        const files = e.dataTransfer.files;
        dropArea.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        if (files.length) {
            file.files = files;
            handleFiles(files, dropArea);
        }
    }

    function handleFiles(files, dropArea) {
        for (const file of files) {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = function () {
                const preview = document.createElement('img');
                preview.style.display = 'inline-block';
                preview.style.maxWidth = '100%';
                preview.style.maxHeight = '200px';
                preview.style.objectFit = 'contain';
                preview.classList.add('preview-image');
                preview.src = reader.result;
                dropArea.appendChild(preview);
            };
        }
    }

    dropArea.addEventListener('dragover', () => {
        dropArea.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
    });
    dropArea.addEventListener('dragleave', () => {
        dropArea.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
    });

    return floatingWindow;
}

if (body) {
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'createFloatingWindow') {
            let doodle = document.querySelector('.floating-window');
            doodle = createFloatingWindow();
            body.appendChild(doodle);
        }
    });
}