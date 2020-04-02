Vue.component('@{.Name}@', {
    props: ['actions', 'data'],
    data: function () {
        return {
            buttons: []
        }
    },
    methods: {
        classForAction: function (action) {
            let classes = ['btn', 'btn-sm'];
            if (action.class === undefined) {
                classes.push('btn-primary');
            } else {
                classes.push(action.class);
            }
            if (action.dropdown !== undefined && action.dropdown.length > 0) {
                classes.push('dropdown-toggle');
            }
            return classes
        },
        click: function (action) {
            if (action.exec !== undefined) {
                action.exec(this.data);
            } else {
                this.alert("error: action '" + action.name + "' exec function not defined");
            }
        }
    },
    template: '@{.Template}@'
});
