import './App.scss';
import cn from 'classnames';

import { useState } from 'react';
import usersFromServer from './api/users';
import photosFromServer from './api/photos';
import albumsFromServer from './api/albums';

const SEX_M = 'm';

const photos = photosFromServer.map((photo) => {
  const albums = albumsFromServer
    .find(al => al.id === photo.albumId);
  const user = usersFromServer.find(us => us.id === albums.userId);

  return {
    ...photo,
    albums,
    user,
  };
});

const filterPhotos = (userActive, albActive, query) => {
  let allPhotos = [...photos];

  if (userActive) {
    if (userActive === 'All') {
      allPhotos = [...photos];
    } else {
      allPhotos = allPhotos.filter(photo => photo.user.name === userActive);
    }
  }

  if (albActive.length) {
    allPhotos = allPhotos
      .filter(photo => albActive.includes(photo.albums.title));
  }

  if (query) {
    allPhotos = allPhotos.filter(photo => photo.title.toLowerCase()
      .includes(query.toLowerCase()));
  }

  return allPhotos;
};

export const App = () => {
  const [userActive, setUserActive] = useState('All');
  const [albumActive, setAlbumActive] = useState([]);
  const [query, setQuery] = useState('');

  const photoData = filterPhotos(userActive, albumActive, query);

  const checkCatActive = (name) => {
    if (albumActive.includes(name)) {
      setAlbumActive(albumActive.filter(alb => alb !== name));
    }

    if (!albumActive.includes(name)) {
      setAlbumActive([...albumActive, name]);
    }
  };

  const resetAll = () => {
    setUserActive('All');
    setAlbumActive([]);
    setQuery('');
  };

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Photos from albums</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">

              <a
                href="#/"
                className={cn({ 'is-active': userActive === 'All' })}
                onClick={() => setUserActive('All')}
              >
                All
              </a>

              {
                usersFromServer.map(user => (
                  <a
                    key={user.id}
                    data-cy="FilterUser"
                    href="#/"
                    className={cn({ 'is-active': userActive === user.name })}
                    onClick={() => setUserActive(user.name)}
                  >
                    {user.name}
                  </a>
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">

                  {
                    query
                    && (
                      /* eslint-disable-next-line jsx-a11y/control-has-associated-label */
                      <button
                        type="button"
                        className="delete"
                        onClick={() => setQuery('')}
                      />
                    )
                  }

                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                onClick={() => {
                  setAlbumActive([]);
                }}
                href="#/"
                className={cn('button', 'is-success', 'mr-6',
                  { 'is-outlined': albumActive.length === 0 })}
              >
                All
              </a>
              {
                albumsFromServer.map(alb => (
                  <a
                    key={alb.id}
                    className={cn('button', 'mr-2', 'my-1',
                      { 'is-info': albumActive.includes(alb.title) })}
                    href="#/"
                    onClick={() => checkCatActive(alb.title)}
                  >
                    {
                      alb.title.length > 20
                        ? `${alb.title.substring(0, 20)}...`
                        : alb.title
                    }
                  </a>
                ))
              }
            </div>

            <div className="panel-block">
              <a
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={() => resetAll()}

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {!photoData.length
            && (
              <p data-cy="NoMatchingMessage">
                No photos matching selected criteria
              </p>
            )}
          {photoData.length !== 0
            && (
              <table
                className="table is-striped is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        ID

                        <a href="#/">
                          <span className="icon">
                            <i data-cy="SortIcon" className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Photo name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-down" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        Album name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort-up" />
                          </span>
                        </a>
                      </span>
                    </th>

                    <th>
                      <span className="is-flex is-flex-wrap-nowrap">
                        User name

                        <a href="#/">
                          <span className="icon">
                            <i className="fas fa-sort" />
                          </span>
                        </a>
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {photoData.map((photo) => {
                    const classLink = photo.user.sex === SEX_M
                      ? 'has-text-link'
                      : 'has-text-danger';

                    return (
                      <tr key={photo.id}>
                        <td
                          className="has-text-weight-bold"
                          data-cy="ProductId"
                        >
                          {photo.id}
                        </td>

                        <td>{photo.title}</td>
                        <td>{photo.albums.title}</td>

                        <td
                          data-cy="ProductUser"
                          className={classLink}
                        >
                          {photo.user.name}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
        </div>
      </div>
    </div>
  );
};
