(async () => {
    const storageGroups = await groupService.getStorageGroups();
    const windowGroups = await groupService.getWindowGroups();

    const store = {
        init(newState) {
            this.setState(newState);

            this.actions.saveGroup = this.actions.saveGroup.bind(this);
            this.actions.removeGroup = this.actions.removeGroup.bind(this);
        },
        state: {},
        setState(newState) {
            this.state = {
                ...this.state,
                ...newState,
            }

            render();
        },
        actions: {
            async saveGroup(title) {
                await groupService.saveGroup(title);

                this.setState({
                    savedTitles: [...this.state.savedTitles, title],
                });
            },
            async removeGroup(title) {
                await groupService.removeStorageGroup(title);

                this.setState({
                    savedTitles: this.state.savedTitles.filter((it) => it !== title),
                });
            },
        },
    };

    const allGroups = [...storageGroups, ...windowGroups].reduce((acc, it) => {
        const accTitles = acc.map((it) => it.title);

        if (accTitles.includes(it.title)) {
            return acc;
        }

        return [...acc, it];
    }, []);

    store.init({
        allGroups,
        savedTitles: storageGroups.map((it) => it.title),
    });

    function handleTitleClick(title) {
        return () => {
            groupService.openGroup(title);
        };
    }

    function handleDotClick(title) {
        return () => {
            if (store.state.savedTitles.includes(title)) {
                store.actions.removeGroup(title);
                return;
            }

            store.actions.saveGroup(title);
        };
    }

    function render() {
        const root = document.getElementById('root');
        root.innerText = '';

        const { allGroups, savedTitles } = store.state;

        allGroups.forEach((group) => {
            const { title, color } = group;
            const isSaved = savedTitles.includes(title);

            const groupWrapper = document.createElement('div');
            groupWrapper.className = 'group';

            const groupTitle = document.createElement('div');
            groupTitle.innerText = title;
            groupTitle.className = `group-title ${isSaved ? 'group-title-saved scale-anim' : ''}`;
            groupTitle.style.backgroundColor = groupService.COLORS[color];
            if (isSaved) {
                groupTitle.addEventListener(
                    'click',
                    handleTitleClick(title),
                );
            }

            const saveDot = document.createElement('div');
            saveDot.className = 'save-dot scale-anim';
            saveDot.style.backgroundColor = groupService.COLORS[color];
            saveDot.title = 'Click to save/remove group';
            saveDot.addEventListener(
                'click',
                handleDotClick(title),
            );

            groupWrapper.appendChild(groupTitle);
            groupWrapper.appendChild(saveDot);
            root.appendChild(groupWrapper);
        });
    }
})();
