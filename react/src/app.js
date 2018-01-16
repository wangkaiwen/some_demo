import React from 'react';
import ReactDOM from 'react-dom';

function formatDate(date) {
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
}

class Child extends React.Component {
    constructor(props) {
        console.log('4、constructor 【子组件】构造函数')
        super(props);
        this.todo = false
    }

    componentWillMount() {
        console.log('5、componentWillMount 【子组件】挂载前')
    }

    componentDidMount() {
        console.log('7、componentDidMount 【子组件】挂载后执行')
    }

    componentWillReceiveProps(props) {
        console.log('---->C、 componentWillReceiveProps 【子组件】当父组件的 state 改变后，这个函数会被执行。props的值：', props)
    }

    shouldComponentUpdate(nextProps, nextState) {
        console.log('---->D、 shouldComponentUpdate 【子组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新', nextProps, nextState)
        this.todo = !this.todo
        if (!this.todo) {
            return false
        }
        return true
    }

    // 修改参数在这里比较好，不要在 render 里做事
    componentWillUpdate(nextProps, nextState) {
        console.log('---->E、 componentWillUpdate(nextProps, nextState) 【子组件】，render渲染前执行')
    }

    // 渲染完毕后执行，会优先执行子组件的渲染函数
    componentDidUpdate() {
        console.log('---->F、 componentDidUpdate 【子组件】 子组件的render已经渲染完毕')
    }

    render() {
        console.log('6、render 【子组件】渲染完毕')
        return <div>child</div>
    }
}

class HelloWord extends React.Component {
    constructor(props) {
        console.log('1、constructor 【父组件】构造函数')
        super(props);
        this.state = {
            count: 0
        }
        this.clickCount = this.clickCount.bind(this)
    }

    // 父组件挂载前，类似 Vue 的 created
    componentWillMount() {
        console.log('2、componentWillMount 【父组件】挂载前')
    }

    // 父组件已经挂载好啦，感觉类似 Vue 的 mounted
    componentDidMount() {
        console.log('8、componentDidMount 【父组件】挂载后执行')
    }

    // 到底要不要重新渲染 render 呢？
    shouldComponentUpdate(nextProps, nextState) {
        console.log('---->A、 shouldComponentUpdate 【父组件】当state被改变后，这个函数会被执行，如果返回true，那么会触发render，否则不会触发render。但注意，事实上的值都会被更新', nextProps, nextState)
        if (nextState.count % 2) {
            return true
        }
        return false
    }

    // state 变化，修改参数在这里比较好，不要在 render 里做事
    componentWillUpdate(nextProps, nextState) {
        console.log('---->B、 componentWillUpdate(nextProps, nextState) 【父组件】，render渲染前执行')
    }

    // 渲染完毕后执行，会优先执行子组件的渲染函数
    componentDidUpdate() {
        console.log('---->G、 componentDidUpdate 【父组件】 父组件的render已经渲染完毕')
    }

    // 渲染函数，this 指向实例本身
    render() {
        console.log('3、render 【父组件】')
        return <div>
            <Child></Child>
            <button onClick={this.clickCount}>当前{this.state.count}，点击增加1</button>
            <table>
                <thead>
                <tr>
                    <td>生命周期钩子函数</td>
                    <td>执行时间</td>
                    <td>描述</td>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>constructor</td>
                    <td>创建组件时调用</td>
                    <td>显然创建组件时，会第一时间调用这个</td>
                </tr>
                <tr>
                    <td>componentWillMount</td>
                    <td>组件挂载前</td>
                    <td>在组件挂载之前调用一次。如果在这个函数里面调用setState，本次的render函数可以看到更新后的state，并且只渲染一次。</td>
                </tr>
                <tr>
                    <td>componentDidMount</td>
                    <td>组件挂载后</td>
                    <td>此时子组件挂载好了，可以在这里使用 refs。<br/>注意，在此之前子组件会先执行完生命周期钩子（比如子组件的这个函数比父组件的这个函数优先执行）</td>
                </tr>
                <tr>
                    <td>componentWillReceiveProps(nextProps)</td>
                    <td>父组件的 state 改变后，子组件的这个函数会被执行</td>
                    <td>父组件的 state 被改变后，子组件的这个函数会执行（参数是props），并且子组件的 render 函数随后会被执行</td>
                </tr>
                <tr>
                    <td>shouldComponentUpdate(nextProps, nextState)</td>
                    <td>state 被改变后（包括父组件），这个函数会被执行；<br/>
                        return true 会触发render和子组件的这个函数（默认true）<br/>
                        return false 值已被修改但不会触发 render；
                    </td>
                    <td>
                        返回true，会导致先执行父组件的 render（渲染），再执行子组件的 componentWillReceiveProps（子组件props更新），再执行子组件的
                        shouldComponentUpdate（子组件是否渲染）；如果子组件返回true，则依次类推；<br/>
                        返回false，上面后续的全部不会执行
                    </td>
                </tr>
                <tr>
                    <td>componentWillUpdate(nextProps, nextState)</td>
                    <td>shouldComponentUpdate 返回 true 后，执行这个（更新前）</td>
                    <td>上面返回 true 才会执行，否则不会</td>
                </tr>
                <tr>
                    <td>componentDidUpdate</td>
                    <td>渲染完毕后执行</td>
                    <td>先执行子组件的这个函数，再执行父组件的这个函数</td>
                </tr>
                <tr>
                    <td>render</td>
                    <td>渲染函数</td>
                    <td>这个是核心，一般返回 JSX 语法的 DOM；<br/>建议不要在这里修改state的值</td>
                </tr>
                <tr>
                    <td>componentWillUnmount</td>
                    <td>组件卸载时执行</td>
                    <td>卸载时执行</td>
                </tr>
                </tbody>
            </table>
        </div>
    }

    clickCount() {
        this.setState({
            count: this.state.count + 1
        })
    }
}

ReactDOM.render(
    <div>
        <HelloWord/>
    </div>,
    document.getElementById('root')
)