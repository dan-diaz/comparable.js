// comparable.js
// BuzzFeed-style image comparison
// by Dan Diaz
// dan-diaz.com
var comparable = (function() {

    function compare(selector, settings) {
        var holders = document.querySelectorAll(selector);
        var opts = {};
        opts.split = settings&&settings.split?settings.split:0.5;
        opts.splitReturn = settings&&settings.splitReturn?settings.splitReturn:false;

        Array.prototype.forEach.call(holders, function(holder) {
            var compareA = holder.dataset&&holder.dataset.compareA?holder.dataset.compareA:null;
            var compareB = holder.dataset&&holder.dataset.compareB?holder.dataset.compareB:null;
            if(compareA === null || compareB === null) {
                return false;
            } else {
                var slider = createImg(compareA,compareB, holder, opts);
                if(slider.children.length) {
                    userEvents(slider, holder, opts);
                }
            }
        });
    }

    // set initial img attributes and styles
    function createImg(a, b, holder, opts) {
        if(a!=='' && b!=='') {
            var compA = document.createElement('div');
            var compB = document.createElement('div');
            var compBSlider = document.createElement('div');
            var imgA = document.createElement('img');
            var imgB = document.createElement('img');
            var zIndexA = 10;
            var zIndexB = zIndexA + 1;

            holder.style.position = 'relative';

            // Element-A is the static background element
            compA.classList.add('compare','compare-a');
            compA.style.zIndex = zIndexA;
            compA.style.display = 'inline-block';

            // Element-B is the sliding foreground element
            compB.classList.add('compare','compare-b');
            compB.style.position = 'absolute';
            compB.style.left = 0;
            compB.style.top = 0;
            compB.style.width = '100%';
            compB.style.height = '100%';
            compB.style.zIndex = zIndexB;
            compB.style.display = 'inline-block';

            // Element-B inner slider
            compBSlider.classList.add('compare-b-slider');
            compBSlider.style.position = 'absolute';
            compBSlider.style.width = 100*opts.split + '%';
            compBSlider.style.overflow = 'hidden';

            // image A - background image
            imgA.src = a;

            // image B - foreground image
            imgB.src = b;

            // insert elements into the DOM
            holder.appendChild(compA);
            holder.appendChild(compB);
            compA.appendChild(imgA);
            compB.appendChild(compBSlider);
            compBSlider.appendChild(imgB);

            // apply image width to holder
            imgA.addEventListener('load', function() {
                holder.style.width = imgA.scrollWidth + 'px';
            })

            // return the element so we can apply events
            return compB;
        } else {
            return false;
        }
    }

    function userEvents(slider, holder, opts) {
        slider.addEventListener('mouseenter', function(evt) {
            evt.target.addEventListener('mousemove', function(e) {
                eventX(e, slider, holder);
            });
        });

        slider.addEventListener('mouseleave', function(evt) {
            evt.target.removeEventListener('mousemove', function(e) {
                eventX(e, slider, holder);
            });
            if(opts.splitReturn) {
                slider.children[0].style.width = 100*opts.split + '%';
            }
        });

        slider.addEventListener('touchstart', function(evt) {
            evt.target.addEventListener('touchmove', function(e) {
                eventX(e, slider, holder);
            });
        });
        slider.addEventListener('touchend', function(evt) {
            evt.target.removeEventListener('touchmove', function(e) {
                eventX(e, slider, holder);
            });
            if(opts.splitReturn) {
                slider.children[0].style.width = 100*opts.split + '%';
            }
        });
    }

    function eventX(e, slider, holder) {
        var clientX = e.touches?e.touches[0].clientX:e.clientX;

        slider.children[0].style.width = clientX - holder.offsetLeft + 'px';
    }

    return {
        compare:compare
    }
})();// test