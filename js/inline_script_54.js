
            function updateTrackingStep(metaTag) {
                let step = metaTag.getAttribute('data-step');
                if (!step.includes('_retry')) {
                    step += '_retry';
                }

                if (metaTag.hasAttribute('data-ddoi')) {
                    if (step.includes('first')) {
                        step = 'second';
                    }
                }
                if (metaTag.hasAttribute('data-ddoi-wifi')) {
                    if (step.includes('msisdn_input')) {
                        step = 'pin_input';
                    }
                }

                metaTag.setAttribute('data-step', step);
            }

            function handleFormTracking(form, metaTag) {
                if (localStorage.getItem('autosubmit')) {
                    localStorage.removeItem('autosubmit');
                    sendTrackingData(metaTag.getAttribute('data-step-autosubmit').trim());
                } else {
                    sendTrackingData(metaTag.getAttribute('data-step').trim());
                }
                updateTrackingStep(metaTag);
            }

            function sendTrackingData(step) {
                let xhr = new XMLHttpRequest();
                let url = "https://wapshop.gameloft.com/assets/5.1/apis/tracking/events/lp_cta_click/";
                xhr.open('POST', (0 <= url.search(/^\/\/.*/) ? window.location.protocol || location.protocol || 'https:' : '') + url, true);
                xhr.setRequestHeader('Content-Type', "application/json");
                xhr.send(JSON.stringify({
                    trxId: "01jdwa3j3js25xh6rfmhmqxm5p",
                    operation: 19513,
                    pageTitle: document.title,
                    sessionId: "128jrz4efabu5sjprnb4toc82",
                    userAgent: window.navigator.userAgent || navigator.userAgent,
                    viewport: window.innerWidth + 'x' + window.innerHeight,
                    url: document.URL,
                    timestamp: Date.now(),
                    step: step,
                    flow: document.querySelector("meta[data-name='lp_cta_click_event_tracking']").getAttribute('data-flow').trim(),
                    formAction: document.querySelector('form').getAttribute('action')
                }));
            }

            document.addEventListener('DOMContentLoaded', function () {
                let metaTag = document.querySelector("meta[data-name='lp_cta_click_event_tracking']");
                const otpInput = document.querySelector('input[autocomplete="one-time-code"]');
                document.querySelectorAll('form').forEach((form) => {
                        if (metaTag && form && !form.getAttribute('data-is-listener-added')) {
                            form.setAttribute('data-is-listener-added', 'true');
                            if (otpInput) {
                                form.addEventListener('submit', function () {
                                    handleFormTracking(form, metaTag);
                                });
                                form.querySelectorAll('button[type="button"]').forEach(function (button) {
                                    button.addEventListener('click', function () {
                                        handleFormTracking(form, metaTag);
                                    });
                                });
                            } else {
                                form.querySelectorAll('button').forEach(function (button) {
                                    button.addEventListener('click', function () {
                                        sendTrackingData(metaTag.getAttribute('data-step').trim());
                                        updateTrackingStep(metaTag);
                                    });
                                });
                            }
                        }
                    }
                )
            });
        