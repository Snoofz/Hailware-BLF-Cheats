// Go to dev tools, press TOP with the dropdown arrow and select index.html on games.crazygames.com
// Paste this script and you'll see the menu come up in the GAME
// Enjoy

let clientWs = new WebSocket("ws://localhost:8080");


class Log {
    static info(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #7289da;');
    }

    static tool(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #FFB6C1;');
    }

    static welcome(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 25px; color: #ff0000;');
    }

    static error(message) {
        console.error(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #dc3545;');
    }

    static success(message) {
        console.log(`%c${message.toUpperCase()}`, 'font-size: 18px; color: #28a745;');
    }
}


let loopBuyButton = null;
let loopOpenButton = null;
let openRate = 250;
let buyRate = 250;
let loginStatus = null;
let creditBuyCaseLoop = false;
let creditOpenCaseLoop = false;

let tmpInterval = null;
let tmpInterval2 = null;

class UIManager {
    constructor() {
        this.UIContext = null;
        this.UIMenus = [];
        this.tabs = [];
        this.notificationStack = []; // Track notifications for stacking
        this.notificationHeight = 100; // Default notification height
        this.notificationMargin = 10; // Margin between notifications
    }

    getAllTabs() {
        return this.tabs;
    }

createNotification(titleText, descriptionText) {
    const notificationContainer = document.createElement('div');
    notificationContainer.className = 'notification-popup';
    notificationContainer.style.position = 'fixed';
    notificationContainer.style.left = '10px';
    notificationContainer.style.bottom = this.calculateNotificationBottom() + 'px';
    notificationContainer.style.transform = 'translateY(100%)';
    notificationContainer.style.backgroundColor = '#36393f';
    notificationContainer.style.color = '#ffffff';
    notificationContainer.style.width = '300px';
    notificationContainer.style.padding = '20px';
    notificationContainer.style.borderRadius = '8px';
    notificationContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    notificationContainer.style.zIndex = '9999';
    notificationContainer.style.transition = 'transform 0.3s ease-in-out';

    const title = document.createElement('h2');
    title.textContent = titleText;
    title.style.fontSize = '22px';
    title.style.textAlign = 'center';
    title.style.marginBottom = '10px';

    const description = document.createElement('p');
    description.textContent = descriptionText;
    description.style.fontSize = '16px';
    description.style.textAlign = 'center';

    notificationContainer.appendChild(title);
    notificationContainer.appendChild(description);

    document.body.appendChild(notificationContainer);

    setTimeout(() => {
        notificationContainer.style.transform = 'translateY(0)';
    }, 50);

    setTimeout(() => {
        notificationContainer.style.transform = 'translateY(100%)';
        setTimeout(() => {
            this.removeNotification(notificationContainer);
            document.body.removeChild(notificationContainer);
        }, 300);
    }, 5000);

    this.makeDraggable(notificationContainer);

    this.notificationStack.push(notificationContainer);
}

calculateNotificationBottom() {
    let totalHeight = this.notificationMargin;
    this.notificationStack.forEach(notification => {
        totalHeight += notification.offsetHeight + this.notificationMargin;
    });
    return totalHeight;
}

removeNotification(notification) {
    const index = this.notificationStack.indexOf(notification);
    if (index !== -1) {
        this.notificationStack.splice(index, 1);
    }
    this.repositionNotifications();
}

repositionNotifications() {
    let totalHeight = this.notificationMargin;
    this.notificationStack.forEach(notification => {
        notification.style.bottom = totalHeight + 'px';
        totalHeight += notification.offsetHeight + this.notificationMargin;
    });
}


    createMenu(elementId, titleText, width = '300px', height = 'auto') {
        const container = document.createElement('div');
        container.id = elementId;
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.backgroundColor = '#36393f';
        container.style.borderRadius = '8px';
        container.style.padding = '20px';
        container.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        container.style.zIndex = '9999';
        container.style.width = width;
        container.style.height = height;
        container.style.overflowY = 'auto';

        const title = document.createElement('h2');
        title.textContent = titleText;
        title.style.color = '#ffffff';
        title.style.marginBottom = '20px';
        title.style.fontSize = '22px';
        title.style.textAlign = 'center';
        container.appendChild(title);

        document.body.appendChild(container);

        this.UIContext = container;

        return container;
    }

     makeDraggable(element) {
         let offsetX, offsetY;

         function handleMouseDown(event) {
             event.preventDefault(); // Prevent default behavior (e.g., text selection)
             const boundingRect = element.getBoundingClientRect();
             offsetX = event.clientX - boundingRect.left;
             offsetY = event.clientY - boundingRect.top;

             // Add event listeners for mouse move and mouse up events
             document.addEventListener('mousemove', handleMouseMove);
             document.addEventListener('mouseup', handleMouseUp);

             // For touch devices, handle touch move and touch end events
             document.addEventListener('touchmove', handleTouchMove);
             document.addEventListener('touchend', handleTouchEnd);
         }

         function handleMouseMove(event) {
             moveElement(event.clientX, event.clientY);
         }

         function handleTouchMove(event) {
             const touch = event.touches[0]; // Get the first touch
             moveElement(touch.clientX, touch.clientY);
         }

         function moveElement(clientX, clientY) {
             element.style.left = clientX - offsetX + 'px';
             element.style.top = clientY - offsetY + 'px';
         }

         function handleMouseUp() {
             cleanupListeners();
         }

         function handleTouchEnd() {
             cleanupListeners();
         }

         function cleanupListeners() {
             document.removeEventListener('mousemove', handleMouseMove);
             document.removeEventListener('mouseup', handleMouseUp);
             document.removeEventListener('touchmove', handleTouchMove);
             document.removeEventListener('touchend', handleTouchEnd);
         }

         const titleBar = element.querySelector('h2');
         titleBar.addEventListener('mousedown', handleMouseDown);
         titleBar.addEventListener('touchstart', handleMouseDown); // Handle touch events on the title bar

         // CSS to ensure smooth dragging and prevent text selection
         element.style.position = 'absolute';
         element.style.cursor = 'move';
         titleBar.style.userSelect = 'none'; // Prevent text selection on title bar
     }

    addButton(buttonText, buttonAction) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.backgroundColor = '#7289da';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginBottom = '10px';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '16px';
        button.addEventListener('click', buttonAction);

        this.UIContext.appendChild(button);
    }

    addLabel(labelText) {
        const label = document.createElement('h3');
        label.textContent = labelText;
        label.style.color = '#ffffff';
        label.style.marginBottom = '20px';
        label.style.fontSize = '18px';
        label.style.textAlign = 'center';

        this.UIContext.appendChild(label);
    }

    addTextInput(placeholderText, valueChangeAction) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholderText;
        input.style.width = 'calc(100% - 20px)';
        input.style.padding = '10px';
        input.style.marginBottom = '20px';
        input.style.borderRadius = '5px';
        input.addEventListener('input', valueChangeAction);

        this.UIContext.appendChild(input);
        return input;
    }

    addSlider(min, max, step, valueChangeAction) {
        const sliderContainer = document.createElement('div');
        sliderContainer.style.width = 'calc(100% - 20px)';
        sliderContainer.style.marginBottom = '20px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.style.width = '100%';
        slider.style.borderRadius = '5px';
        slider.addEventListener('input', valueChangeAction);

        sliderContainer.appendChild(slider);
        this.UIContext.appendChild(sliderContainer);

        return slider;
    }

    createTabMenu(tabs) {
        const tabContainer = document.createElement('div');
        tabContainer.style.display = 'flex';
        tabContainer.style.borderBottom = '1px solid #7289da';
        tabContainer.style.marginBottom = '20px';

        const contentContainers = tabs.map(() => document.createElement('div'));

        tabs.forEach((tab, index) => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.title;
            tabButton.style.flex = '1';
            tabButton.style.padding = '10px';
            tabButton.style.backgroundColor = '#36393f';
            tabButton.style.color = '#ffffff';
            tabButton.style.border = 'none';
            tabButton.style.cursor = 'pointer';
            tabButton.style.fontWeight = 'bold';
            tabButton.style.fontSize = '16px';
            tabButton.addEventListener('click', () => {
                contentContainers.forEach((container, idx) => {
                    if (idx !== index) {
                        container.style.display = 'none';
                    }
                });
                contentContainers[index].style.display = 'block';
            });

            this.tabs.push(tabButton);
            tabContainer.appendChild(tabButton);

            const uiTab = new UITab(tab.title, contentContainers[index], document.createElement('div'));
            uiTab.content.innerHTML = tab.content;
            tab.uiTab = uiTab;
        });

        this.UIContext.appendChild(tabContainer);

        contentContainers.forEach(container => {
            container.style.display = 'none';
            this.UIContext.appendChild(container);
        });

        if (contentContainers.length > 0) {
            contentContainers[0].style.display = 'block';
        }

        return { UITabs: tabs, Containers: contentContainers };
    }

    addTabsToTabMenu(existingTabs, newTabs) {
        const contentContainers = newTabs.map(() => document.createElement('div'));

        newTabs.forEach((tab, index) => {
            const tabButton = document.createElement('button');
            tabButton.textContent = tab.title;
            tabButton.style.flex = '1';
            tabButton.style.padding = '10px';
            tabButton.style.backgroundColor = '#36393f';
            tabButton.style.color = '#ffffff';
            tabButton.style.border = 'none';
            tabButton.style.cursor = 'pointer';
            tabButton.style.fontWeight = 'bold';
            tabButton.style.fontSize = '16px';
            tabButton.addEventListener('click', () => {
                contentContainers.forEach((container, idx) => {
                    if (idx !== index) {
                        container.style.display = 'none';
                    }
                });
                contentContainers[index].style.display = 'block';
            });

            existingTabs.push(tabButton);
            const uiTab = new UITab(tab.title, contentContainers[index], document.createElement('div'));
            uiTab.content.innerHTML = tab.content;
            tab.uiTab = uiTab;
        });

        existingTabs.forEach(tab => {
            this.UIContext.appendChild(tab);
        });

        contentContainers.forEach(container => {
            container.style.display = 'none';
            this.UIContext.appendChild(container);
        });

        if (contentContainers.length > 0) {
            contentContainers[0].style.display = 'block';
        }
    }

    showTabContent(index, tabs, contentContainer) {
        contentContainer.innerHTML = '';

        const content = document.createElement('div');
        content.innerHTML = tabs[index].content;
        content.style.color = '#ffffff';
        content.style.fontSize = '16px';
        contentContainer.appendChild(content);

        this.activeTabContent = content;
    }
}

class UITab {
    constructor(title, contentContainer, content) {
        this.title = title;
        this.contentContainer = contentContainer;
        this.content = content;
        this.isHidden = true;
    }

    static getContentContainer() {
        return this.contentContainer;
    }

    addButton(buttonText, buttonAction) {
        const button = document.createElement('button');
        button.textContent = buttonText;
        button.style.width = '100%';
        button.style.padding = '10px';
        button.style.backgroundColor = '#7289da';
        button.style.color = '#ffffff';
        button.style.border = 'none';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.marginBottom = '10px';
        button.style.fontWeight = 'bold';
        button.style.fontSize = '16px';
        button.addEventListener('click', buttonAction);

        this.contentContainer.appendChild(button);
        return button;
    }

    addLabel(labelText) {
        const label = document.createElement('h3');
        label.innerHTML = labelText;

        label.style.marginBottom = '20px';
        label.style.fontSize = '18px';
        label.style.textAlign = 'center';

        this.contentContainer.appendChild(label);

        return label;
    }


    addTextInput(placeholderText, valueChangeAction) {
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = placeholderText;
        input.style.width = 'calc(100% - 1px)';
        input.style.padding = '10px';
        input.style.marginBottom = '20px';
        input.style.borderRadius = '5px';
        input.addEventListener('input', valueChangeAction);

        this.contentContainer.appendChild(input);
        return input;
    }

    addSlider(min, max, step, valueChangeAction) {
        const sliderContainer = document.createElement('div');
        sliderContainer.style.width = 'calc(100% - 20px)';
        sliderContainer.style.marginBottom = '20px';

        const slider = document.createElement('input');
        slider.type = 'range';
        slider.min = min;
        slider.max = max;
        slider.step = step;
        slider.style.width = '100%';
        slider.style.borderRadius = '5px';
        slider.addEventListener('input', valueChangeAction);

        sliderContainer.appendChild(slider);
        this.contentContainer.appendChild(sliderContainer);

        return slider;
    }

    showContent() {
        const allTabs = this.contentContainer.parentElement.querySelectorAll('.tab-content');
        allTabs.forEach(tab => {
            tab.style.display = 'none';
        });

        if (this.isHidden) {
            this.contentContainer.style.display = 'block';
            this.isHidden = false;
        }
    }
}

function SHA512(str) {
        function int64(msint_32, lsint_32) {
            this.highOrder = msint_32;
            this.lowOrder = lsint_32;
        }

        var H = [new int64(0x6a09e667, 0xf3bcc908), new int64(0xbb67ae85, 0x84caa73b),
            new int64(0x3c6ef372, 0xfe94f82b), new int64(0xa54ff53a, 0x5f1d36f1),
            new int64(0x510e527f, 0xade682d1), new int64(0x9b05688c, 0x2b3e6c1f),
            new int64(0x1f83d9ab, 0xfb41bd6b), new int64(0x5be0cd19, 0x137e2179)
        ];

        var K = [new int64(0x428a2f98, 0xd728ae22), new int64(0x71374491, 0x23ef65cd),
            new int64(0xb5c0fbcf, 0xec4d3b2f), new int64(0xe9b5dba5, 0x8189dbbc),
            new int64(0x3956c25b, 0xf348b538), new int64(0x59f111f1, 0xb605d019),
            new int64(0x923f82a4, 0xaf194f9b), new int64(0xab1c5ed5, 0xda6d8118),
            new int64(0xd807aa98, 0xa3030242), new int64(0x12835b01, 0x45706fbe),
            new int64(0x243185be, 0x4ee4b28c), new int64(0x550c7dc3, 0xd5ffb4e2),
            new int64(0x72be5d74, 0xf27b896f), new int64(0x80deb1fe, 0x3b1696b1),
            new int64(0x9bdc06a7, 0x25c71235), new int64(0xc19bf174, 0xcf692694),
            new int64(0xe49b69c1, 0x9ef14ad2), new int64(0xefbe4786, 0x384f25e3),
            new int64(0x0fc19dc6, 0x8b8cd5b5), new int64(0x240ca1cc, 0x77ac9c65),
            new int64(0x2de92c6f, 0x592b0275), new int64(0x4a7484aa, 0x6ea6e483),
            new int64(0x5cb0a9dc, 0xbd41fbd4), new int64(0x76f988da, 0x831153b5),
            new int64(0x983e5152, 0xee66dfab), new int64(0xa831c66d, 0x2db43210),
            new int64(0xb00327c8, 0x98fb213f), new int64(0xbf597fc7, 0xbeef0ee4),
            new int64(0xc6e00bf3, 0x3da88fc2), new int64(0xd5a79147, 0x930aa725),
            new int64(0x06ca6351, 0xe003826f), new int64(0x14292967, 0x0a0e6e70),
            new int64(0x27b70a85, 0x46d22ffc), new int64(0x2e1b2138, 0x5c26c926),
            new int64(0x4d2c6dfc, 0x5ac42aed), new int64(0x53380d13, 0x9d95b3df),
            new int64(0x650a7354, 0x8baf63de), new int64(0x766a0abb, 0x3c77b2a8),
            new int64(0x81c2c92e, 0x47edaee6), new int64(0x92722c85, 0x1482353b),
            new int64(0xa2bfe8a1, 0x4cf10364), new int64(0xa81a664b, 0xbc423001),
            new int64(0xc24b8b70, 0xd0f89791), new int64(0xc76c51a3, 0x0654be30),
            new int64(0xd192e819, 0xd6ef5218), new int64(0xd6990624, 0x5565a910),
            new int64(0xf40e3585, 0x5771202a), new int64(0x106aa070, 0x32bbd1b8),
            new int64(0x19a4c116, 0xb8d2d0c8), new int64(0x1e376c08, 0x5141ab53),
            new int64(0x2748774c, 0xdf8eeb99), new int64(0x34b0bcb5, 0xe19b48a8),
            new int64(0x391c0cb3, 0xc5c95a63), new int64(0x4ed8aa4a, 0xe3418acb),
            new int64(0x5b9cca4f, 0x7763e373), new int64(0x682e6ff3, 0xd6b2b8a3),
            new int64(0x748f82ee, 0x5defb2fc), new int64(0x78a5636f, 0x43172f60),
            new int64(0x84c87814, 0xa1f0ab72), new int64(0x8cc70208, 0x1a6439ec),
            new int64(0x90befffa, 0x23631e28), new int64(0xa4506ceb, 0xde82bde9),
            new int64(0xbef9a3f7, 0xb2c67915), new int64(0xc67178f2, 0xe372532b),
            new int64(0xca273ece, 0xea26619c), new int64(0xd186b8c7, 0x21c0c207),
            new int64(0xeada7dd6, 0xcde0eb1e), new int64(0xf57d4f7f, 0xee6ed178),
            new int64(0x06f067aa, 0x72176fba), new int64(0x0a637dc5, 0xa2c898a6),
            new int64(0x113f9804, 0xbef90dae), new int64(0x1b710b35, 0x131c471b),
            new int64(0x28db77f5, 0x23047d84), new int64(0x32caab7b, 0x40c72493),
            new int64(0x3c9ebe0a, 0x15c9bebc), new int64(0x431d67c4, 0x9c100d4c),
            new int64(0x4cc5d4be, 0xcb3e42b6), new int64(0x597f299c, 0xfc657e2a),
            new int64(0x5fcb6fab, 0x3ad6faec), new int64(0x6c44198c, 0x4a475817)
        ];

        var W = new Array(64);
        var a, b, c, d, e, f, g, h, i, j;
        var T1, T2;
        var charsize = 8;

        function utf8_encode(str) {
            return unescape(encodeURIComponent(str));
        }

        function str2binb(str) {
            var bin = [];
            var mask = (1 << charsize) - 1;
            var len = str.length * charsize;

            for (var i = 0; i < len; i += charsize) {
                bin[i >> 5] |= (str.charCodeAt(i / charsize) & mask) << (32 - charsize - (i % 32));
            }

            return bin;
        }

        function binb2hex(binarray) {
            var hex_tab = '0123456789abcdef';
            var str = '';
            var length = binarray.length * 4;
            var srcByte;

            for (var i = 0; i < length; i += 1) {
                srcByte = binarray[i >> 2] >> ((3 - (i % 4)) * 8);
                str += hex_tab.charAt((srcByte >> 4) & 0xF) + hex_tab.charAt(srcByte & 0xF);
            }

            return str;
        }

        function safe_add_2(x, y) {
            var lsw, msw, lowOrder, highOrder;

            lsw = (x.lowOrder & 0xFFFF) + (y.lowOrder & 0xFFFF);
            msw = (x.lowOrder >>> 16) + (y.lowOrder >>> 16) + (lsw >>> 16);
            lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            lsw = (x.highOrder & 0xFFFF) + (y.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (x.highOrder >>> 16) + (y.highOrder >>> 16) + (lsw >>> 16);
            highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            return new int64(highOrder, lowOrder);
        }

        function safe_add_4(a, b, c, d) {
            var lsw, msw, lowOrder, highOrder;

            lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF);
            msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (lsw >>> 16);
            lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (lsw >>> 16);
            highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            return new int64(highOrder, lowOrder);
        }

        function safe_add_5(a, b, c, d, e) {
            var lsw, msw, lowOrder, highOrder;

            lsw = (a.lowOrder & 0xFFFF) + (b.lowOrder & 0xFFFF) + (c.lowOrder & 0xFFFF) + (d.lowOrder & 0xFFFF) + (e.lowOrder & 0xFFFF);
            msw = (a.lowOrder >>> 16) + (b.lowOrder >>> 16) + (c.lowOrder >>> 16) + (d.lowOrder >>> 16) + (e.lowOrder >>> 16) + (lsw >>> 16);
            lowOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            lsw = (a.highOrder & 0xFFFF) + (b.highOrder & 0xFFFF) + (c.highOrder & 0xFFFF) + (d.highOrder & 0xFFFF) + (e.highOrder & 0xFFFF) + (msw >>> 16);
            msw = (a.highOrder >>> 16) + (b.highOrder >>> 16) + (c.highOrder >>> 16) + (d.highOrder >>> 16) + (e.highOrder >>> 16) + (lsw >>> 16);
            highOrder = ((msw & 0xFFFF) << 16) | (lsw & 0xFFFF);

            return new int64(highOrder, lowOrder);
        }

        function maj(x, y, z) {
            return new int64(
                (x.highOrder & y.highOrder) ^ (x.highOrder & z.highOrder) ^ (y.highOrder & z.highOrder),
                (x.lowOrder & y.lowOrder) ^ (x.lowOrder & z.lowOrder) ^ (y.lowOrder & z.lowOrder)
            );
        }

        function ch(x, y, z) {
            return new int64(
                (x.highOrder & y.highOrder) ^ (~x.highOrder & z.highOrder),
                (x.lowOrder & y.lowOrder) ^ (~x.lowOrder & z.lowOrder)
            );
        }

        function rotr(x, n) {
            if (n <= 32) {
                return new int64(
                    (x.highOrder >>> n) | (x.lowOrder << (32 - n)),
                    (x.lowOrder >>> n) | (x.highOrder << (32 - n))
                );
            } else {
                return new int64(
                    (x.lowOrder >>> n) | (x.highOrder << (32 - n)),
                    (x.highOrder >>> n) | (x.lowOrder << (32 - n))
                );
            }
        }

        function sigma0(x) {
            var rotr28 = rotr(x, 28);
            var rotr34 = rotr(x, 34);
            var rotr39 = rotr(x, 39);

            return new int64(
                rotr28.highOrder ^ rotr34.highOrder ^ rotr39.highOrder,
                rotr28.lowOrder ^ rotr34.lowOrder ^ rotr39.lowOrder
            );
        }

        function sigma1(x) {
            var rotr14 = rotr(x, 14);
            var rotr18 = rotr(x, 18);
            var rotr41 = rotr(x, 41);

            return new int64(
                rotr14.highOrder ^ rotr18.highOrder ^ rotr41.highOrder,
                rotr14.lowOrder ^ rotr18.lowOrder ^ rotr41.lowOrder
            );
        }

        function gamma0(x) {
            var rotr1 = rotr(x, 1),
                rotr8 = rotr(x, 8),
                shr7 = shr(x, 7);

            return new int64(
                rotr1.highOrder ^ rotr8.highOrder ^ shr7.highOrder,
                rotr1.lowOrder ^ rotr8.lowOrder ^ shr7.lowOrder
            );
        }

        function gamma1(x) {
            var rotr19 = rotr(x, 19);
            var rotr61 = rotr(x, 61);
            var shr6 = shr(x, 6);

            return new int64(
                rotr19.highOrder ^ rotr61.highOrder ^ shr6.highOrder,
                rotr19.lowOrder ^ rotr61.lowOrder ^ shr6.lowOrder
            );
        }

        function shr(x, n) {
            if (n <= 32) {
                return new int64(
                    x.highOrder >>> n,
                    x.lowOrder >>> n | (x.highOrder << (32 - n))
                );
            } else {
                return new int64(
                    0,
                    x.highOrder << (32 - n)
                );
            }
        }

        str = utf8_encode(str);
        strlen = str.length * charsize;
        str = str2binb(str);

        str[strlen >> 5] |= 0x80 << (24 - strlen % 32);
        str[(((strlen + 128) >> 10) << 5) + 31] = strlen;

        for (var i = 0; i < str.length; i += 32) {
            a = H[0];
            b = H[1];
            c = H[2];
            d = H[3];
            e = H[4];
            f = H[5];
            g = H[6];
            h = H[7];

            for (var j = 0; j < 80; j++) {
                if (j < 16) {
                    W[j] = new int64(str[j * 2 + i], str[j * 2 + i + 1]);
                } else {
                    W[j] = safe_add_4(gamma1(W[j - 2]), W[j - 7], gamma0(W[j - 15]), W[j - 16]);
                }

                T1 = safe_add_5(h, sigma1(e), ch(e, f, g), K[j], W[j]);
                T2 = safe_add_2(sigma0(a), maj(a, b, c));
                h = g;
                g = f;
                f = e;
                e = safe_add_2(d, T1);
                d = c;
                c = b;
                b = a;
                a = safe_add_2(T1, T2);
            }

            H[0] = safe_add_2(a, H[0]);
            H[1] = safe_add_2(b, H[1]);
            H[2] = safe_add_2(c, H[2]);
            H[3] = safe_add_2(d, H[3]);
            H[4] = safe_add_2(e, H[4]);
            H[5] = safe_add_2(f, H[5]);
            H[6] = safe_add_2(g, H[6]);
            H[7] = safe_add_2(h, H[7]);
        }

        var binarray = [];
        for (var i = 0; i < H.length; i++) {
            binarray.push(H[i].highOrder);
            binarray.push(H[i].lowOrder);
        }
        return binb2hex(binarray);
    }

if ((window.location.href.includes("multiplayerpiano") && window.location.href.includes("dev") || window.location.href.includes("net"))) {
    Log.welcome("Welcome to Hailware");
    Log.tool("Tool made by Foonix");
    let uiManager = new UIManager();
    let mainMenu = uiManager.createMenu("epicUI", "Hailware Web", "400px", "500px");
    uiManager.makeDraggable(mainMenu);


    let tabs = uiManager.createTabMenu([{
            title: 'Scripts',
            content: '<p>This is the content of Tab 1</p>'
        },
        {
            title: 'Themes',
            content: '<p>This is the content of Tab 2</p>'
        },
        {
            title: 'Plugins',
            content: '<p>This is the content of Tab 3</p>'
        }
    ]);

    tabs = tabs.UITabs;

    tabs[0].uiTab.addButton("Neptune", () => {
        Log.info("Loading Neptune Bot made by Foonix...");
        fetch("https://raw.githubusercontent.com/Snoofz/Neptune/main/old/neptune-old.js")
            .then(response => response.text())
            .then(scriptContent => {
            var script = document.createElement('script');
            script.textContent = scriptContent;
            document.head.appendChild(script);
            Log.tool("Neptune loaded successfully!");
        })
        .catch(error => Log.error('Error loading script:', error));
    });

    tabs[0].uiTab.addButton("PeriOS", () => {
        Log.info("Loading PeriOS made by Peri...");
        fetch("https://raw.githubusercontent.com/Snoofz/scripts/main/PeriOS.js")
            .then(response => response.text())
            .then(scriptContent => {
            var script = document.createElement('script');
            script.textContent = scriptContent;
            document.head.appendChild(script);
            Log.tool("PeriOS loaded successfully!");
        })
        .catch(error => Log.error('Error loading script:', error));
    });
}

let players = [];
let totalPlayers = 0;
let uiManager = new UIManager();

class UnityRichTextComponent {
    static colorToSpan(unityRichText) {
        unityRichText = unityRichText.replace(/<color=(.+)>/g, '<span style="color: $1">');
        unityRichText = unityRichText.replace(/<\/color>/g, '</span>');
        return unityRichText;
    }

    static sizeToSpan(unityRichText) {
        unityRichText = unityRichText.replace(/<size=(\d+)>/g, '<span style="font-size: $1px">');
        unityRichText = unityRichText.replace(/<\/size>/g, '</span>');
        return unityRichText;
    }
}

function GetWeapon() {}
    let weaponMap = undefined;

    fetch('https://raw.githubusercontent.com/Snoofz/Hailware-Assets/main/weaponmap.json')
        .then(response => response.json())
        .then(data => {
        weaponMap = data;

        // Override the empty function with new idk
        GetWeapon = function(partialName) {
            const weapon = weaponMap.find(weapon => weapon.WeaponType.toLowerCase().includes(partialName.toLowerCase()));
            if (weapon) {
                return weapon;
            } else {
                return null;
            }
        }
    }).catch(error => console.error('Error fetching JSON:', error));

    function dropWeapon(weaponName) {
        Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'DropGun', GetWeapon(weaponName).weaponId);
    }

setTimeout(() => {
if (window.location.href.includes("bullet-force-multiplayer") || window.location.href.includes("localhost")) {
    Log.welcome("Welcome to Hailware");
    Log.tool("Tool made by Foonix (Ban bypass by Yellowberry, fixed by Foonix)");

    Log.tool("Setting up window.fetch override...");
    clientWs.onmessage = function(evt) {
        let json = JSON.parse(evt.data);
        console.log(json);

        if (json.m === "playerJoin") {
            let playerName = json.playerName.trim();

            if (!isPlayerInArray(playerName)) {
                totalPlayers++;
                uiManager.getAllTabs()[2].textContent = `Players (${totalPlayers})`;
                if (playerName.includes("<color=") && playerName.includes("</color>")) {
                    playerName = UnityRichTextComponent.colorToSpan(playerName);
                }

                if (playerName.includes("<size=") && playerName.includes("</size>")) {
                    playerName = UnityRichTextComponent.sizeToSpan(playerName);
                }
                players.push(tabs[2].uiTab.addLabel(playerName));
            } else {
                console.log("Existing Player: ", playerName);
            }
        }

        if (json.m === "roomLeave") {
            totalPlayers = 0;
            players.forEach(playerElement => playerElement.remove());
            players = [];
            uiManager.getAllTabs()[2].textContent = `Players (${totalPlayers})`;
        }

        if (json.m === "playerLeave") {
            let playerName = json.playerName.trim();

            for (let i = 0; i < players.length; i++) {
                if (players[i].textContent === playerName) {
                    players[i].remove();
                    players.splice(i, 1);
                    i--;
                    totalPlayers--;
                    uiManager.getAllTabs()[2].textContent = `Players (${totalPlayers})`;
                }
            }
        }
    };

    // Sigma
    function isPlayerInArray(playerName) {
        return players.some(playerElement => playerElement.textContent.includes(playerName));
    }

    Log.tool("Done setting up window.fetch override!");

    Log.tool("Setting up console.log override...");
    Log.tool("Done setting up console.log override!");

    let mainMenu = uiManager.createMenu("epicUI", "Hailware Web", "400px", "500px");
    uiManager.makeDraggable(mainMenu);


    let tabs = uiManager.createTabMenu([{
            title: 'Hacks',
            content: '<p>This is the content of Tab 1</p>'
        },
        {
            title: 'Web Exploits',
            content: '<p>This is the content of Tab 2</p>'
        },
        {
            title: 'Players',
            content: '<p>This is the content of Tab 3</p>'
        }
    ]);

    console.log(uiManager.getAllTabs());
    uiManager.getAllTabs()[2].textContent = "Players (0)";

    let hackTabs = uiManager.createTabMenu([{
            title: 'Off-Host',
            content: '<p>Idk</p>'
        },
        {
            title: 'Host',
            content: '<p>Nuts</p>'
        },
        {
            title: 'Weapons',
            content: '<p>Balls idk</p>'
        }
    ]);

    // Initiate an empty function

// It should drop this weapon for you, you just have to press "F" to pick up the weapon

    let spoofName = "";
    let contentContainer = tabs.Containers;
    tabs = tabs.UITabs;
    let idkContainer = hackTabs.Containers;
    hackTabs = hackTabs.UITabs;
    let knifeAura = false;
    let knifeAuraLoop = undefined;
    let spamEnabled = false;
    let spam = undefined;
    let antiFlashEnabled = false;
    let antiFlashLoop = undefined;
    let infAmmoEnabled = false;
    let intervalReloadAllRounds = undefined;

    let isMasterClientIntervalRunning = false;
    let intervalFindNewMasterClient = undefined;
    let intervalBecomeMasterClient = undefined;
    let sexinterval = undefined;

    function toggleMainMenu() {
        if (mainMenu.style.display === 'none') {
            mainMenu.style.display = 'block';
        } else {
            mainMenu.style.display = 'none';
        }
    }

    document.addEventListener('keydown', function(event) {
        if (event.key === 'Insert') {
            toggleMainMenu();
        }
    });

    function toggleMasterClientIntervals() {
        if (isMasterClientIntervalRunning) {
            clearInterval(intervalBecomeMasterClient);
            clearInterval(intervalFindNewMasterClient);
            isMasterClientIntervalRunning = false;
            console.log("MasterClientIntervals: %cOff", "color: red"); // "Off" in red
        } else {
            intervalBecomeMasterClient = setInterval(() => {
                let unityInstance = Crazygames.getUnityInstance();
                unityInstance.SendMessage('PlayerBody(Clone)', 'BecomeMasterClient');
            }, 1);
            intervalFindNewMasterClient = setInterval(() => {
                let unityInstance = Crazygames.getUnityInstance();
                unityInstance.SendMessage('PlayerBody(Clone)', 'FindNewMasterClient');
            }, 1);
            isMasterClientIntervalRunning = true;
            console.log("MasterClientIntervals: %cOn", "color: green"); // "On" in green

        }
    }

    // 0 Off-Host
    // 1 Host
    // 2 Weapon Stuff

    hackTabs[0].uiTab.addButton("Add Kill To Streak", () => {
        uiManager.createNotification('Hailware', 'Added a kill to your killstreak!');
        Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'AddKillToStreak');
    });

    hackTabs[0].uiTab.addButton("Knife Aura", () => {
        knifeAura = !knifeAura;
        if (knifeAura) {
            uiManager.createNotification('Hailware', 'Knife aura was enabled!');
            knifeAuraLoop = setInterval(() => Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'DamageWithKnife'), 10);
        } else {
            uiManager.createNotification('Hailware', 'Knife aura was disabled!');
            clearInterval(knifeAuraLoop);
        }
    });

    hackTabs[1].uiTab.addButton("Grenade Spam", () => {
        spamEnabled = !spamEnabled;
        if (spamEnabled) {
            uiManager.createNotification('Hailware', 'Grenade Spam was Enabled!');
            var Module = Crazygames.getUnityInstance().Module;
            var GameObject = "PlayerBody(Clone)";
            var Function = "createGrenade";
            var Parameters = [
                "true",
            ]
            var ArgumentTypes = [
                "bool",
            ];
            var Arguments = [GameObject, Function, Parameters];
            var Response = Module.ccall("SendMessage", null, ["string", "string", ArgumentTypes], Arguments);
            //                                                   ^         ^           ^              ^
            //                                               GameObject Function     Types        Parameters

            spam = setInterval(function () {
                var Response = Module.ccall("SendMessage", null, ["string", "string", ArgumentTypes], Arguments);
            }, 100);
        } else {
          uiManager.createNotification('Hailware', 'Grenade Spam was disabled!');
          clearInterval(spam);
        }
    });

    weaponMap.forEach(weapon => {
      hackTabs[2].uiTab.addButton(weapon.WeaponType, () => {
          uiManager.createNotification('Hailware', 'Dropped ' + weapon.WeaponType);
          dropWeapon(weapon.WeaponType);
      });
    });

    hackTabs[0].uiTab.addButton("Reset Deaths", () => {
          uiManager.createNotification('Hailware', 'Reset Deaths!');
        Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'UpdateMPDeaths', 0);
    });

    hackTabs[0].uiTab.addButton("Respawn", () => {
        uiManager.createNotification('Hailware', 'Respawned!');
        Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'Respawn');
    });

    hackTabs[0].uiTab.addButton("TimeScale 1.3", () => {
          uiManager.createNotification('Hailware', 'Set Time Scale!');
        Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'SetTimeScale', 1.3);
    });

    hackTabs[0].uiTab.addButton("Anti Flashbangs", () => {
        antiFlashEnabled = !antiFlashEnabled;
        if (!antiFlashEnabled) {
          uiManager.createNotification('Hailware', 'Anti-Flashbangs was disabled!');
          clearInterval(antiFlashLoop);
            return;
        } else {
                      uiManager.createNotification('Hailware', 'Anti-Flashbangs was enabled!');
            antiFlashLoop = setInterval(function () {
                Crazygames.getUnityInstance().SendMessage("GameManager/Overlay Canvas/Flash", "ClearFlash");
            }, 1);
        }
    });

    let usernameSpoof = hackTabs[0].uiTab.addTextInput("Spoofed Name", () => {

    });

    hackTabs[0].uiTab.addButton("Chat Name Spoof", () => {
        spoofName = usernameSpoof.value;
        uiManager.createNotification('Hailware', `Spoofing name to ${spoofName}!`);
        if (sexinterval !== undefined) {
            clearInterval(sexinterval);
        }
        sexinterval = setInterval(() => {
        let unityInstance = Crazygames.getUnityInstance();
        unityInstance.SendMessage(
            'PlayerBody(Clone)',
            'UsernameChanged',
            `<color=#FF0000FF>[DEV]</color> <color=#800020>[C]</color> ${spoofName}`
        );
        }, 1);
    });

    hackTabs[0].uiTab.addButton("End Match", () => {
        uiManager.createNotification('Hailware', `Ended the match!`);
        Crazygames.getUnityInstance().SendMessage('Match Manager(Clone)', 'EndMatch');
     });

    hackTabs[0].uiTab.addButton("Creative Mode", () => {
        uiManager.createNotification('Hailware', `You are now in Minecraft!`);
        Crazygames.getUnityInstance().SendMessage("GameManager", "InstantiateSpectator");
    });

    hackTabs[1].uiTab.addButton("(H) Restart Match", () => {
        uiManager.createNotification('Hailware', `Restarted the match!`);
         Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'RestartMatch');
         Crazygames.getUnityInstance().SendMessage('PlayerBody(Clone)', 'ActualRestartMatch');
     });

    hackTabs[0].uiTab.addButton("Infinite Ammo", () => {
        if (infAmmoEnabled) {
        uiManager.createNotification('Hailware', `Infinite Ammo was enabled!`);
            intervalReloadAllRounds = setInterval(() => {
                let unityInstance = Crazygames.getUnityInstance();
                unityInstance.SendMessage('PlayerBody(Clone)', 'ReloadAllRounds');
            }, 10);
        } else {
        uiManager.createNotification('Hailware', `Infinite Ammo was disabled!`);
            clearInterval(intervalReloadAllRounds);
        }
    });

    let usernameField = tabs[1].uiTab.addTextInput("Username", () => {
        Log.info('Text input changed');
    });


    let passwordField = tabs[1].uiTab.addTextInput("Password", () => {
        Log.info('Text input changed');
    });

    if (localStorage.blfUsername && localStorage.blfPasswordHash && localStorage.blfPasswordRaw) {
        usernameField.value = localStorage.blfUsername;
        passwordField.value = localStorage.blfPasswordRaw;
    }

    passwordField.type = "password";

    tabs[1].uiTab.addButton('Login', () => {
        login(usernameField.value, passwordField.value);
    });

     tabs[1].uiTab.addButton('Register', async () => {
        let response = await registerAccount(usernameField.value, passwordField.value);

        if (response) {
            login("PC-" + usernameField.value, passwordField.value);
        } else {
            loginStatus.textContent = 'Registration Failed';
        }
    });

    loginStatus = tabs[1].uiTab.addLabel('N/A');

    let weapons = {
        "1": {
            "weaponName": "AK-12"
        },
        "2": {
            "weaponName": "RPG-7V2"
        },
        "3": {
            "weaponName": "SAIGA 12K"
        },
        "4": {
            "weaponName": "M40A5"
        },
        "5": {
            "weaponName": "MP412 REX"
        },
        "6": {
            "weaponName": "FAMAS"
        },
        "7": {
            "weaponName": "SCAR-H"
        },
        "8": {
            "weaponName": "MPX"
        },
        "9": {
            "weaponName": "M67 Frag"
        },
        "10": {
            "weaponName": "Knife"
        },
        "11": {
            "weaponName": "Flashbang"
        },
        "13": {
            "weaponName": "M18 Smoke"
        },
        "14": {
            "weaponName": "M4A1"
        },
        "15": {
            "weaponName": "MG4"
        },
        "16": {
            "weaponName": "Compact .45"
        },
        "18": {
            "weaponName": "Butterfly Knife"
        },
        "19": {
            "weaponName": "M200"
        },
        "20": {
            "weaponName": "AS VAL"
        },
        "21": {
            "weaponName": "G18"
        },
        "22": {
            "weaponName": "M320 HE"
        },
        "23": {
            "weaponName": "M320 DART"
        },
        "24": {
            "weaponName": "870 MCS"
        },
        "25": {
            "weaponName": "HAND"
        },
        "26": {
            "weaponName": "MP5"
        },
        "27": {
            "weaponName": "AK-47"
        },
        "28": {
            "weaponName": "Vector"
        },
        "29": {
            "weaponName": "M60"
        },
        "30": {
            "weaponName": "Desert Eagle"
        },
        "31": {
            "weaponName": "UMP"
        },
        "33": {
            "weaponName": "MK 11"
        },
        "34": {
            "weaponName": "P90"
        },
        "35": {
            "weaponName": "AUG"
        },
        "36": {
            "weaponName": "Shorty SG"
        },
        "37": {
            "weaponName": "CS-LR4"
        },
        "38": {
            "weaponName": "FAD"
        },
        "39": {
            "weaponName": "Tommy Gun"
        },
        "40": {
            "weaponName": "MP40"
        },
        "41": {
            "weaponName": "CX Scorpio"
        },
        "42": {
            "weaponName": "44 Magnum"
        },
        "43": {
            "weaponName": "M16"
        },
        "44": {
            "weaponName": "Lewis Gun"
        },
        "45": {
            "weaponName": "M1911"
        },
        "46": {
            "weaponName": "ACR"
        },
        "47": {
            "weaponName": "AK-5C"
        },
        "48": {
            "weaponName": "BRT HS1"
        },
        "49": {
            "weaponName": "L85"
        },
        "50": {
            "weaponName": "Tec 9"
        },
        "51": {
            "weaponName": "AI-AWP"
        },
        "52": {
            "weaponName": "Minebea 9"
        },
        "53": {
            "weaponName": "Badger Q"
        },
        "54": {
            "weaponName": "FAL"
        },
        "55": {
            "weaponName": "MP7"
        },
        "56": {
            "weaponName": "SPAS-12"
        },
        "57": {
            "weaponName": "Karambit"
        },
        "58": {
            "weaponName": "Hatchet"
        },
        "59": {
            "weaponName": "Crossbow"
        },
        "60": {
            "weaponName": "Minigun"
        },
        "61": {
            "weaponName": "VSS"
        },
        "62": {
            "weaponName": "G36"
        },
        "63": {
            "weaponName": "F2000"
        },
        "64": {
            "weaponName": "Galil Ace 23"
        },
        "65": {
            "weaponName": "M240B"
        },
        "66": {
            "weaponName": "Kar 98"
        },
        "67": {
            "weaponName": "Groza"
        }
    }

    function login(username, password) {
        fetch("https://server.blayzegames.com/OnlineAccountSystem//login.php?&requiredForMobile=882503852", {
            "headers": {
                "accept": "*/*",
                "accept-language": "en-US,en;q=0.9",
                "content-type": "application/x-www-form-urlencoded",
                "sec-ch-ua": "\"Opera GX\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Referer": "https://games.crazygames.com/",
            },
            "body": `username=${username}&password=${SHA512(password)}&store=BALYZE_WEB&useJSON=true&locale=english&tutorialr=1`,
            "method": "POST"
        }).then(res => res.json()).then(res => {
            if (res.status == 1) {
                Log.error(`[BLF Killer]: Successfully loggged into '${username}' (PC User)`);
                localStorage.blfUsername = username;
                localStorage.blfPasswordHash = SHA512(password);
                localStorage.blfPasswordRaw = password;

                Log.info("Set account info successfully!");
                loginStatus.textContent = 'Login Success';

                 loopOpenButton = tabs[1].uiTab.addButton('Open Case Loop', () => {
                     open_credit_case_loop();
                 });

                loopBuyButton = tabs[1].uiTab.addButton('Buy Case Loop', () => {
                    buy_credit_case_loop();
                });
            } else {
                Log.error(`[BLF Killer]: Failed to login to '${username}' perhaps you type in an incorrect password? (PC User)`);
                loginStatus.textContent = 'Login Failed';
            }
        });
    }

    // SQL cant handle the heat
    function kill_servers() {
        buyRate = 1; // SQL cant handle the heat
        openRate = 1; // SQL cant handle the heat
        buy_credit_case_loop(); // SQL cant handle the heat
        open_credit_case_loop(); // SQL cant handle the heat
    }

    function open_credit_case_loop() {
        creditOpenCaseLoop = !creditOpenCaseLoop;
        if (creditOpenCaseLoop) {
            loopOpenButton.style.color = '#43b581';
            tmpInterval2 = setInterval(() => {
                fetch("https://server.blayzegames.com/OnlineAccountSystem/open_case.php?requiredForMobile=1040657058", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-ch-ua": "\"Opera GX\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site",
                        "Referer": "https://games.crazygames.com/",
                    },
                    "body": `username=${localStorage.blfUsername}&password=${localStorage.blfPasswordHash}&case_type=credit&username=${localStorage.blfUsername}&password=${localStorage.blfPasswordHash}`,
                    "method": "POST"
                }).then(res => res.json()).then(res => {
                    if (res.status == 1) {
                        console.log(res);
                        Log.info(`[BLF Killer]: Unlocked a cammo on account '${localStorage.blfUsername}' for the ${weapons[res.weapon].weaponName} (PC User)`);
                    } else {
                        Log.error(`[BLF Killer]: Failed to open credit case on account '${localStorage.blfUsername}' perhaps you dont have any cases to open? (PC User)`);
                    }
                });
            }, openRate);
        } else {
            loopOpenButton.style.color = '#f04747';
            clearInterval(tmpInterval2);
        }
    }

    function buy_credit_case_loop() {
        creditBuyCaseLoop = !creditBuyCaseLoop;
        if (creditBuyCaseLoop) {
            loopBuyButton.style.color = '#43b581';
            tmpInterval = setInterval(() => {
                fetch("https://server.blayzegames.com/OnlineAccountSystem/buy_case.php?requiredForMobile=1770212018", {
                    "headers": {
                        "accept": "*/*",
                        "accept-language": "en-US,en;q=0.9",
                        "content-type": "application/x-www-form-urlencoded",
                        "sec-ch-ua": "\"Opera GX\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                        "sec-ch-ua-mobile": "?0",
                        "sec-ch-ua-platform": "\"Windows\"",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "cross-site",
                        "Referer": "https://games.crazygames.com/",
                    },
                    "body": `username=${localStorage.blfUsername}&password=${localStorage.blfPasswordHash}&case_type=credit&amount=1&username=${localStorage.blfUsername}&password=${localStorage.blfPasswordHash}`,
                    "method": "POST"
                }).then(res => res.json()).then(res => {
                    if (res.status == 1) {
                        Log.info(`[BLF Killer]: Purchased 1 credit case on account '${localStorage.blfUsername}' (PC User)`);
                    } else {
                        Log.error(`[BLF Killer]: Failed to purchase credit case on account '${localStorage.blfUsername}' perhaps you dont have any credits to buy cases? (PC User)`);
                    }
                });
            }, buyRate);
        } else {
            loopBuyButton.style.color = '#f04747';
            clearInterval(tmpInterval);
        }
    }
}
}, 2000);

async function registerAccount(username, password) {
    let response = false;
    let a = await fetch("https://server.blayzegames.com/OnlineAccountSystem//register.php?&requiredForMobile=878717759", {
        "headers": {
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/x-www-form-urlencoded",
            "sec-ch-ua": "\"Opera GX\";v=\"109\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "cross-site",
            "Referer": "https://games.crazygames.com/",
        },
        "body": `newAccountInfo=id%24%23%40(_field_name_value_separator_*%26%25%5e%24%23%40(_fields_separator_*%26%25%5eusername%24%23%40(_field_name_value_separator_*%26%25%5ePC-${username}%24%23%40(_fields_separator_*%26%25%5epassword%24%23%40(_field_name_value_separator_*%26%25%5e${SHA512(password)}%24%23%40(_fields_separator_*%26%25%5eemail%24%23%40(_field_name_value_separator_*%26%25%5ePC-${username}_%40unregistered.com%24%23%40(_fields_separator_*%26%25%5ecustominfo%24%23%40(_field_name_value_separator_*%26%25%5e%3c%3fxml%20version%3d%221.0%22%20encoding%3d%22utf-16%22%3f%3e%0a%3cAS_CustomInfo%20xmlns%3axsd%3d%22http%3a%2f%2fwww.w3.org%2f2001%2fXMLSchema%22%20xmlns%3axsi%3d%22http%3a%2f%2fwww.w3.org%2f2001%2fXMLSchema-instance%22%3e%0a%20%20%3cbfAccountInfo%3e%0a%20%20%20%20%3cshow%3efalse%3c%2fshow%3e%0a%20%20%20%20%3cmoney%3e5000%3c%2fmoney%3e%0a%20%20%20%20%3cxp%3e0%3c%2fxp%3e%0a%20%20%20%20%3cstreamer%3efalse%3c%2fstreamer%3e%0a%20%20%20%20%3cdeviceID%20%2f%3e%0a%20%20%20%20%3cclan%20%2f%3e%0a%20%20%20%20%3ccases%3e1%3c%2fcases%3e%0a%20%20%20%20%3ccases_CREDIT%3e0%3c%2fcases_CREDIT%3e%0a%20%20%20%20%3ccases_ADS%3e0%3c%2fcases_ADS%3e%0a%20%20%20%20%3ccases_OW%3e0%3c%2fcases_OW%3e%0a%20%20%20%20%3cgold_OW%3e0%3c%2fgold_OW%3e%0a%20%20%20%20%3cgold%3e0%3c%2fgold%3e%0a%20%20%20%20%3ctotalGoldBought%3e0%3c%2ftotalGoldBought%3e%0a%20%20%20%20%3chacker%3efalse%3c%2fhacker%3e%0a%20%20%20%20%3cv%3e1.0%3c%2fv%3e%0a%20%20%20%20%3cplatform%20%2f%3e%0a%20%20%20%20%3ctKills%3e0%3c%2ftKills%3e%0a%20%20%20%20%3ctDeaths%3e0%3c%2ftDeaths%3e%0a%20%20%20%20%3cmWon%3e0%3c%2fmWon%3e%0a%20%20%20%20%3cmLost%3e0%3c%2fmLost%3e%0a%20%20%20%20%3cknifeKills%3e0%3c%2fknifeKills%3e%0a%20%20%20%20%3cexplKills%3e0%3c%2fexplKills%3e%0a%20%20%20%20%3cnukes%3e0%3c%2fnukes%3e%0a%20%20%20%20%3chighStrk%3e0%3c%2fhighStrk%3e%0a%20%20%20%20%3cmostKills%3e0%3c%2fmostKills%3e%0a%20%20%20%20%3ccharacterCamos%20%2f%3e%0a%20%20%20%20%3cglovesCamos%20%2f%3e%0a%20%20%20%20%3cbulletTracerColors%20%2f%3e%0a%20%20%20%20%3ceLs%3e0%3c%2feLs%3e%0a%20%20%20%20%3cplayerID%3e0%3c%2fplayerID%3e%0a%20%20%20%20%3cnotificationMessage%20%2f%3e%0a%20%20%3c%2fbfAccountInfo%3e%0a%20%20%3cweaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e14%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e1%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e6%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e4%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e3%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e7%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e8%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e20%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e19%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e15%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e2%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e5%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e16%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e18%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e21%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e22%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e23%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e24%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e25%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e26%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e27%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e28%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e29%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e30%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e31%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e33%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e34%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e35%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e36%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e37%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e38%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e39%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e40%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e41%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e42%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e43%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e0%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e44%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e45%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e46%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e47%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e48%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e49%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e50%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e51%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e52%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e53%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e54%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e55%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e56%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e57%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e58%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e59%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e60%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e61%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e62%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e63%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e64%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e65%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e66%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%20%20%3cBF_WeaponInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e67%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlocked%3e0%3c%2funlocked%3e%0a%20%20%20%20%20%20%3ccOL%3e0%2c0%2c0%3c%2fcOL%3e%0a%20%20%20%20%20%20%3caOL%3e0%2c0%2c0%3c%2faOL%3e%0a%20%20%20%20%20%20%3csOL%3e0%2c0%2c0%3c%2fsOL%3e%0a%20%20%20%20%20%20%3cbOL%3e0%2c0%2c0%3c%2fbOL%3e%0a%20%20%20%20%20%20%3cc%3e0%2c0%2c0%3c%2fc%3e%0a%20%20%20%20%20%20%3ca%3e0%2c0%2c0%3c%2fa%3e%0a%20%20%20%20%20%20%3cs%3e0%2c0%2c0%3c%2fs%3e%0a%20%20%20%20%20%20%3cb%3e0%2c0%2c0%3c%2fb%3e%0a%20%20%20%20%3c%2fBF_WeaponInfo%3e%0a%20%20%3c%2fweaponInfo%3e%0a%20%20%3cthrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e9%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e11%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e13%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e0%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%20%20%3cBF_ThrowableInfo%3e%0a%20%20%20%20%20%20%3cweapon%3e0%3c%2fweapon%3e%0a%20%20%20%20%20%20%3cunlockedWeapon%3e0%3c%2funlockedWeapon%3e%0a%20%20%20%20%3c%2fBF_ThrowableInfo%3e%0a%20%20%3c%2fthrowableInfo%3e%0a%20%20%3cos%3enot%20set%3c%2fos%3e%0a%20%20%3cmodel%3enot%20set%3c%2fmodel%3e%0a%20%20%3crd%3e0%3c%2frd%3e%0a%20%20%3ced%3e0%3c%2fed%3e%0a%3c%2fAS_CustomInfo%3e%24%23%40(_fields_separator_*%26%25%5eclan%24%23%40(_field_name_value_separator_*%26%25%5e%24%23%40(_fields_separator_*%26%25%5eunbanned%24%23%40(_field_name_value_separator_*%26%25%5e0%24%23%40(_fields_separator_*%26%25%5e&requireEmailActivation=false&referralPlayer=&store=BALYZE_WEB&useJSON=true`,
        "method": "POST"
    });

    let res = await a.text();

        if (res.includes("success")) {
           response = true;
        } else {
            response = false;
        }

    return response;
}
