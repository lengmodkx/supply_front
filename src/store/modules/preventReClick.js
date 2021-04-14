import Vue from 'vue'

const preventReClick = Vue.directive('preventReClick', {
    inserted: function (el, binding) {
        el.addEventListener('click', () => {
            if (!el.disabled) {
                el.disabled = true
                el.classList.add("disable");
                setTimeout(() => {
                    el.disabled = false
                    el.classList.remove("disable");
                }, binding.value || 2000)
            }
        })
    }
});


export { preventReClick }