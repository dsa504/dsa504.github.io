(($) => {

    $(document).ready(() => {

        const $window = $(window);
        const $image = $('.teaserimage-image');
        $window.on('scroll', () => {
            const top = $window.scrollTop();

            if (top < 0 || top > 1500) { return; }
            $image
                .css('transform', 'translate3d(0px, '+top/3+'px, 0px)')
                .css('opacity', 1-Math.max(top/700, 0));
        });
        $window.trigger('scroll');

    });

})(jQuery);

