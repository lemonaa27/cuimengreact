import React, { Component } from 'react'
import { PropTypes } from 'prop-types'
import { ListView } from 'antd-mobile'
import { Icon } from 'components'

class ViewList extends Component {

  static propTypes = {
    dataSource: PropTypes.array.isRequired,
    hasMore: PropTypes.bool.isRequired,
    queryMoreList: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    Header: PropTypes.func,
    Row: PropTypes.func.isRequired,
    footerMsg: PropTypes.object.isRequired,
  }

  constructor (props) {
    super(props)

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    })

    this.state = {
      dataSource: dataSource.cloneWithRows({}),
      isLoading: true,
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.dataSource !== this.props.dataSource) {
      this.setState({
        isLoading: false,
        dataSource: this.state.dataSource.cloneWithRows(nextProps.dataSource),
      })
    }
  }

  onEndReached = (event) => {
    if (this.state.isLoading || !this.props.hasMore) {
      return
    }
    if (event) {
      if (this.props.hasMore) {
        this.setState({ isLoading: true })
        this.props.queryMoreList()
      }
    }
  }

  renderFooter = () => {
    const { isLoading } = this.state
    const { dataSource, hasMore, footerMsg } = this.props
    const message = dataSource.length ?
      (hasMore ? '上拉加载更多' : (footerMsg && footerMsg.noMore) || '没有更多数据了~') :
      (footerMsg && footerMsg.empty) || <p>暂无数据~</p>
    return (
      <div style={{ textAlign: 'center', paddingTop: '6px' }}>
        {isLoading ? <Icon type="loading" /> : message}
      </div>
    )
  }

  render () {
    const { Header, Row, className } = this.props
    const { dataSource } = this.state

    return (
      <ListView
        dataSource={dataSource}
        renderHeader={Header}
        renderFooter={::this.renderFooter}
        renderRow={Row}
        className={className}
        pageSize={10}
        scrollRenderAheadDistance={500}
        scrollEventThrottle={20}
        useBodyScroll
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    )
  }
}

export default ViewList
