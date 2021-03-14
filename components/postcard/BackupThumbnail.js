import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import ScaledImage from '../../components/ScaledImage';
import {COLORS} from '../../themes';

export default class BackupThumbnail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      url:
        'https://media.wired.com/photos/5a0201b14834c514857a7ed7/master/pass/1217-WI-APHIST-01.jpg',
      loading: true,
    };
  }

  componentDidMount() {
    let url = this.props.content.url;
    fetch(url).then((resp) => {
      if (resp.ok) {
        if (resp.headers.get('content-type').includes('html')) {
          resp.text().then((html) => {
            var $ = cherrio.load(html);
            let l = $('meta[property="og:image"]').attr('content');
            if (l) {
              this.setState({url: l});
              console.log('Url has OG image', url);
            } else {
              console.log('Unable to get OG image', url);
            }
            this.setState({loading: false});
          });
        } else if (resp.headers.get('content-type').includes('image')) {
          console.log('Url already an image', url);
          this.setState({url, loading: false});
        }
      }
    });
  }

  render() {
    return (
      <View>
        <View>
          {this.state.loading ? (
            <ActivityIndicator
              size={100}
              color={COLORS.primary}
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2000,
              }}
            />
          ) : null}
          <ScaledImage url={this.state.url} />
        </View>
      </View>
    );
  }
}
