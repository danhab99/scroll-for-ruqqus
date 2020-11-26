import React from 'react'
import { ScrollView } from 'react-native'
import Postcard from '../components/Postcard'
import Style from '../theme'

export default class Comments extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log('POST CLIENT', this.props.route.params.post.client)
    this.props.route.params.post.client.APIRequest({ type: "GET", path: `front/comments` }).then(d => console.log('TEST COMMENTS', d))
  }

  render() {
    return  (
      <ScrollView style={Style.view}>
        <Postcard post={this.props.route.params.post} />
      </ScrollView>
    )
  }
}