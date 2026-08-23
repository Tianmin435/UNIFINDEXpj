(function () {
    const contactStyles = document.createElement("style");

    contactStyles.textContent = `
        .uf-contact-widget {
            position: fixed;
            right: 25px;
            bottom: 25px;
            z-index: 99999;
            display: flex;
            align-items: flex-end;
            gap: 12px;
            font-family: "Myanmar Text", "Noto Sans Myanmar", Arial, sans-serif;
        }

        .uf-contact-toggle {
            width: 50px;
            height: 50px;
            border: none;
            border-radius: 50%;
            background: #64b5f6;
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 6px 20px rgba(100, 181, 246, 0.35), 0 0 0 0 rgba(100, 181, 246, 0.45);
            transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }

        .uf-contact-toggle:hover {
            background: #42a5f5;
            transform: translateY(-3px);
            box-shadow: 0 10px 25px rgba(100, 181, 246, 0.40), 0 0 0 8px rgba(100, 181, 246, 0.08);
        }

        .uf-contact-toggle:active {
            transform: scale(0.94);
        }

        .uf-contact-icon {
            width: 22px;
            height: 22px;
            transition: transform 0.3s ease;
        }

        .uf-contact-widget.uf-active .uf-contact-icon {
            transform: rotate(90deg);
        }

        .uf-contact-box {
            width: 300px;
            background: rgba(255, 255, 255, 0.98);
            border-radius: 14px;
            padding: 16px;
            border: 1px solid rgba(100, 181, 246, 0.25);
            box-shadow: 0 15px 45px rgba(0, 0, 0, 0.12), 0 0 25px rgba(100, 181, 246, 0.12);
            opacity: 0;
            visibility: hidden;
            transform: translateX(25px) scale(0.95);
            transform-origin: bottom right;
            transition: opacity 0.3s ease, transform 0.35s cubic-bezier(.2,.8,.2,1), visibility 0.35s;
        }

        .uf-contact-widget.uf-active .uf-contact-box {
            opacity: 1;
            visibility: visible;
            transform: translateX(0) scale(1);
        }

        .uf-contact-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 12px;
        }

        .uf-contact-title {
            font-size: 18px;
            font-weight: 700;
            color: #1f3b53;
        }

        .uf-contact-subtitle {
            font-size: 11px;
            color: #78909c;
            margin-top: 3px;
            line-height: 1.4;
        }

        .uf-contact-login-note {
            margin: 0 0 12px;
            padding: 8px 10px;
            border-radius: 8px;
            background: #eef7ff;
            color: #4b6b7b;
            font-size: 11px;
            line-height: 1.45;
        }

        .uf-contact-close {
            width: 26px;
            height: 26px;
            border: none;
            background: transparent;
            color: #78909c;
            font-size: 18px;
            line-height: 26px;
            cursor: pointer;
            border-radius: 50%;
            transition: 0.2s ease;
        }

        .uf-contact-close:hover {
            background: #eef7ff;
            color: #42a5f5;
        }

        .uf-contact-group {
            margin-bottom: 10px;
        }

        .uf-contact-group label {
            display: block;
            font-size: 12px;
            font-weight: 600;
            color: #455a64;
            margin-bottom: 4px;
        }

        .uf-contact-group input,
        .uf-contact-group select,
        .uf-contact-group textarea {
            width: 100%;
            border: 1px solid #d9e6ef;
            border-radius: 8px;
            padding: 8px 10px;
            font-size: 12px;
            outline: none;
            background: #fafcfe;
            color: #455a64;
            transition: 0.2s ease;
            font-family: "Myanmar Text", "Noto Sans Myanmar", Arial, sans-serif;
        }

        .uf-contact-group input:focus,
        .uf-contact-group select:focus,
        .uf-contact-group textarea:focus {
            border-color: #64b5f6;
            background: #ffffff;
            box-shadow: 0 0 0 3px rgba(100, 181, 246, 0.10);
        }

        .uf-contact-group textarea {
            height: 65px;
            resize: none;
        }

        .uf-contact-send {
            width: 100%;
            border: none;
            padding: 9px;
            border-radius: 8px;
            background: #64b5f6;
            color: #ffffff;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            font-family: "Myanmar Text", "Noto Sans Myanmar", Arial, sans-serif;
            transition: background 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
            box-shadow: 0 5px 15px rgba(100, 181, 246, 0.25);
        }

        .uf-contact-send:hover {
            background: #42a5f5;
            transform: translateY(-1px);
            box-shadow: 0 8px 20px rgba(100, 181, 246, 0.32);
        }

        .uf-contact-send:active {
            transform: scale(0.98);
        }

        .uf-contact-success {
            display: none;
            text-align: center;
            padding: 15px 0;
        }

        .uf-contact-success-text {
            color: #4caf50;
            font-size: 13px;
            font-weight: 600;
            line-height: 1.5;
            margin-bottom: 12px;
        }

        .uf-contact-form.uf-submitted .uf-contact-group,
        .uf-contact-form.uf-submitted .uf-contact-send {
            display: none;
        }

        .uf-contact-form.uf-submitted .uf-contact-success {
            display: block;
        }

        .uf-contact-dismiss {
            width: 100%;
            background: #64b5f6;
            color: #ffffff;
            border: none;
            padding: 9px;
            border-radius: 8px;
            font-size: 13px;
            font-weight: 600;
            cursor: pointer;
            font-family: "Myanmar Text", "Noto Sans Myanmar", Arial, sans-serif;
            transition: background 0.25s ease;
        }

        .uf-contact-dismiss:hover {
            background: #42a5f5;
        }

        @media (max-width: 600px) {
            .uf-contact-widget {
                right: 15px;
                bottom: 15px;
            }

            .uf-contact-toggle {
                width: 46px;
                height: 46px;
            }

            .uf-contact-box {
                width: calc(100vw - 75px);
                max-width: 300px;
                padding: 14px;
            }
        }
    `;

    document.head.appendChild(contactStyles);

    const widget = document.createElement("div");
    widget.className = "uf-contact-widget";

    widget.innerHTML = `
        <div class="uf-contact-box">
            <div class="uf-contact-header">
                <div>
                    <div class="uf-contact-title">
                        ဆက်သွယ်ရန်
                    </div>
                    <div class="uf-contact-subtitle">
                        သင့်အကြံပြုချက်များကို ကျွန်ုပ်တို့ထံ ပေးပို့နိုင်ပါသည်။
                    </div>
                </div>
                <button type="button" class="uf-contact-close" aria-label="ပိတ်ရန်">
                    ×
                </button>
            </div>
            <p class="uf-contact-login-note">ဤ feedback ကို သင်ဝင်ရောက်ထားသော account နှင့် တွဲဖက်၍ ပေးပို့မည်ဖြစ်သည်။</p>
            <form class="uf-contact-form">
                <div class="uf-contact-group">
                    <label>ဆက်သွယ်ရသည့်အကြောင်းအရာ</label>
                    <select name="reason">
                        <option value="general">အထွေထွေမေးမြန်းရန်</option>
                        <option value="feedback">အကြံပြုချက်ပေးရန်</option>
                        <option value="problem">ပြဿနာတင်ပြရန်</option>
                        <option value="university">တက္ကသိုလ်အချက်အလက် မေးမြန်းရန်</option>
                        <option value="other">အခြား</option>
                    </select>
                </div>
                <div class="uf-contact-group">
                    <label>စာသား</label>
                    <textarea name="message" placeholder="သင့်စာကို ရေးသားပါ..." required></textarea>
                </div>
                <button type="submit" class="uf-contact-send">
                    ပေးပို့မည်
                </button>
                <div class="uf-contact-success">
                    <div class="uf-contact-success-text">
                        ✓ သင့်စာကို အောင်မြင်စွာ ပေးပို့ပြီးပါပြီ။
                    </div>
                    <button type="button" class="uf-contact-dismiss">
                        ပိတ်မည်
                    </button>
                </div>
            </form>
        </div>
        <button type="button" class="uf-contact-toggle" aria-label="ဆက်သွယ်ရန်" aria-expanded="false">
            <svg class="uf-contact-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 11.5a8.38 8.38 0 0 1-9 8.5 8.5 8.5 0 0 1-4-.95L3 21l1.95-4.95A8.5 8.5 0 1 1 21 11.5z"/>
            </svg>
        </button>
    `;

    document.body.appendChild(widget);

    const toggle = widget.querySelector(".uf-contact-toggle");
    const closeButton = widget.querySelector(".uf-contact-close");
    const form = widget.querySelector(".uf-contact-form");
    const dismissButton = widget.querySelector(".uf-contact-dismiss");

    function openContact() {
        widget.classList.add("uf-active");
        toggle.setAttribute("aria-expanded", "true");
    }

    function closeContact() {
        widget.classList.remove("uf-active");
        toggle.setAttribute("aria-expanded", "false");
    }

    function toggleContact() {
        if (widget.classList.contains("uf-active")) {
            closeContact();
        } else {
            openContact();
        }
    }

    toggle.addEventListener("click", async function (event) {
        event.stopPropagation();
        const user = await window.unifindexAuth?.getCurrentUser();
        if (!user) {
            alert("Feedback ပေးရန် အကောင့်ဝင်ထားရန် လိုအပ်ပါသည်။ ကျေးဇူးပြု၍ Sign in သို့မဟုတ် Register အရင်လုပ်ပါ။");
            return;
        }
        toggleContact();
    });

    closeButton.addEventListener("click", function (event) {
        event.stopPropagation();
        closeContact();
    });

    dismissButton.addEventListener("click", function (event) {
        event.stopPropagation();
        closeContact();
        setTimeout(function () {
            form.classList.remove("uf-submitted");
            form.reset();
        }, 300);
    });

    document.addEventListener("click", function (event) {
        if (widget.classList.contains("uf-active") && !widget.contains(event.target)) {
            closeContact();
        }
    });

    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && widget.classList.contains("uf-active")) {
            closeContact();
        }
    });

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        const user = await window.unifindexAuth?.getCurrentUser();
        if (!user) {
            alert("Feedback ပေးရန် အကောင့်ဝင်ထားရန် လိုအပ်ပါသည်။");
            closeContact();
            return;
        }

        const formData = new FormData(form);
        const reason = formData.get("reason");
        const message = formData.get("message");

        try {
            const { error } = await window.supabase
                .createClient(window.UNIFINDEX_SUPABASE_URL, window.UNIFINDEX_SUPABASE_ANON_KEY)
                .from("feedback")
                .insert({ user_id: user.id, reason, message });

            if (error) throw error;
        } catch (error) {
            alert("Feedback ကို ပေးပို့မရသေးပါ။ Supabase setup နှင့် internet connection ကို စစ်ဆေးပါ။");
            return;
        }

        form.classList.add("uf-submitted");
    });
})();
