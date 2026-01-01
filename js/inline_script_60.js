
var Gameloft = Gameloft || new Object();
Gameloft.popup = Gameloft.popup || new Object();
Gameloft.popup.box = Gameloft.popup.box || new Object();

Gameloft.popup.box.legal = Gameloft.popup.box.legal || new Object();
Gameloft.popup.box.legal.init = function (popupElement) {    
    this.element = popupElement;
    if (!this.element || !this.element.id) return false;
    if ((typeof $ === 'undefined' || !$.magnificPopup) && !this.element.glPopup) return false;

    document.querySelector('#' + this.element.id + ' a[href="#close"]').addEventListener('click', () => {
        event.preventDefault();
        try {
            $.magnificPopup.close();
        } catch (e) {
            
        }
    });

    const setContent = (data, divParent) => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data;
        while (tempDiv.firstChild) {
            divParent.appendChild(tempDiv.firstChild);
        }
    };

    document.querySelectorAll('a[href*="conditions.php"]').forEach(link => {
        link.addEventListener('click', event => {
            event.preventDefault();
            const id = Gameloft.popup.box.legal.element.id;
            const div = document.querySelector('#' + id + ' > .content-section');
            div.innerHTML = ''; // Clear existing content
            const hrefValue = event.target.closest('a').getAttribute('href');
            const urlParams = new URLSearchParams(new URL(hrefValue).search);
            const legalType = ((urlParams.get('type') || 'general') + (document.documentElement.lang ? '_' + document.documentElement.lang : '')).toLowerCase();
            const data = sessionStorage.getItem(legalType);
            if (!data) {
                const loader = document.querySelector('#' + id + ' > .spinner-section');
                loader.style.display = 'block'; // Show loading
                fetch(hrefValue, {method: 'POST'})
                        .then(response => {
                            if (!response.ok)
                                throw new Error('Network response was not ok');
                            return response.text().then(text => {
                                if (text.includes('<html')) {
                                    window.location.href = response.url;
                                    return null;
                                }
                                return text;
                            });
                        })
                        .then(data => {
                            if (!data) return;
                            loader.style.display = 'none'; //Hide loading
                            sessionStorage.setItem(legalType, data);
                            setContent(data, div);
                        })
                        .catch(error => console.error('There was a problem with the fetch operation:', error));
            } else {
                setContent(data, div);
            }
            Gameloft.popup.box.legal.show();
        });
    });
};

Gameloft.popup.box.legal.show = function () {
    if (!this.element || !this.element.id) return false;

    try {
        $.magnificPopup.open({
            items: [{
                src: '#' + this.element.id,
                type: 'inline'
            }],
            fixedContentPos: true,
            fixedBgPos: true,
            overflowY: 'auto',
            closeBtnInside: true,
            preloader: false,
            midClick: true,
            removalDelay: 0,
            mainClass: 'gl-mfp-zoom-in gl-mfp-blur',
            callbacks: {
                close: function () {
                    document.body.style.overflow = '';
                }
            }
        });
    } catch (e) {
        this.element.glPopup && this.element.glPopup({});
    }
};
