import React from 'react';

import routeComponents from 'rrCustom/routeComponents';

export default class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log('Components', routeComponents);
    const Component = routeComponents?.[0].component ?? null;
    return <div>App 2
      <Component />
    </div>;
  }
}
