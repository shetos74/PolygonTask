/**
 * Author: Amr Samir
 * 
 * Description: 
 *  - An example of a plugin that listens to another 
 *    plugin's state changes (Map plugin), and log that state.
 */


import React from 'react';
import { connect } from 'react-redux';
import { selectorsRegistry, actionsRegistry } from '@penta-b/ma-lib';


class MapClickComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    /**
     * Description: 
     *  - React lifecycle method, here we check for state changes.
     */
    componentDidUpdate(prevProps) {

        if (this.props.isActive) {
            const prevClick = prevProps.singleClick;

            const currentClick = this.props.singleClick;

            if (currentClick && currentClick != prevClick) {
                this.id && this.props.removeMapClickResult(this.id);

                this.props.showMapClickResult({
                    coordinate: currentClick.coordinate
                }, id => this.id = id);
            }
        }
    }

    render() {
        return null;
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        singleClick: selectorsRegistry.getSelector('selectMapSingleClick', state, ownProps.reducerId)
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showMapClickResult: (props, onAdd) => dispatch(actionsRegistry.getActionCreator('showComponent', 'ma-plugin-new-hosny', 'MapClickResult', props, onAdd)),
        removeMapClickResult: (id) => dispatch(actionsRegistry.getActionCreator('removeComponent', id))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MapClickComponent);