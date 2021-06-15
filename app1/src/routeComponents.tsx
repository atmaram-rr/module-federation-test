import React from 'react';
import { DatePicker } from 'antd';

export class App extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>App 1</h1>
        <DatePicker format="YYYY MMMM DD" />
      </div>
    );
  }
}

const routeComponents = [
  {
    exact: false,
    key: '/schedule',
    path: '/schedule',
    component: App,
  },
];

export default routeComponents;
