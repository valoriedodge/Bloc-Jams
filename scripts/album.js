
var getSongNumberCell = function (number){
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     var $row = $(template);
     var onHover = function (event){
        var song = $(this).find('.song-item-number');
        var songNumber = parseInt(song.attr('data-song-number'));
        if (songNumber !== currentlyPlayingSongNumber){
            song.html(playButtonTemplate);
        }
     };
     var offHover = function (event){
         var song = $(this).find('.song-item-number');
         var songNumber = parseInt(song.attr('data-song-number'));
         console.log("songNumber type is " + typeof songNumber + "\n and currentlyPlayingSongNumber type is " + typeof currentlyPlayingSongNumber);
         if (songNumber !== currentlyPlayingSongNumber){
             song.html(songNumber);
          }
     };
    
     var clickHandler = function(){
         var songNumber = parseInt($(this).attr('data-song-number'));

         if (currentlyPlayingSongNumber === null) {
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             currentSoundFile.play();
         } else if (currentlyPlayingSongNumber === songNumber) {
             $(this).html(playButtonTemplate);
             currentSoundFile.togglePlay();
             if (currentSoundFile.isPaused()){
                 $(this).html(playButtonTemplate);
             } else {
                 $(this).html(pauseButtonTemplate);
             }
         } else if (currentlyPlayingSongNumber !== songNumber) {
             var currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
             currentlyPlayingSongElement.html(currentlyPlayingSongElement.attr('data-song-number'));
             $(this).html(pauseButtonTemplate);
             setSong(songNumber);
             currentSoundFile.play();
         }

         updatePlayerBarSong();
     };
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
 };
 
var setSong = function(songNumber) {
    if (currentSoundFile) {
         currentSoundFile.stop();
     }
    currentlyPlayingSongNumber = songNumber;
    currentSongFromAlbum = currentAlbum.songs[songNumber-1];
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioUrl, {
        formats: ['mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile){
        currentSoundFile.setVolume(volume);
    }
};


var setCurrentAlbum = function(album) {
     currentAlbum = album;
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
 
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};
var nextSong = function() {
    var album = currentAlbum;
    var song = currentSongFromAlbum;
    var getLastSongNumber = function(index) {
        return index == 0 ? album.songs.length : index;
    };
    
    var currentSongIndex = trackIndex(album, song);
    currentSongIndex++;
    
    if (currentSongIndex >= album.songs.length) {
        currentSongIndex = 0;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var previousSong = function() {
    var album = currentAlbum;
    var song = currentSongFromAlbum;
    var getLastSongNumber = function(index) {
        return index === (album.songs.length-1) ? 1 : index + 2;
    };
    
    var currentSongIndex = trackIndex(album, song);
    currentSongIndex--;
    
    if (currentSongIndex < 0) {
        currentSongIndex = album.songs.length - 1;
    }
    
    setSong(currentSongIndex + 1);
    currentSoundFile.play();
    updatePlayerBarSong();
    
    var lastSongNumber = getLastSongNumber(currentSongIndex);
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
    
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber);
    
};

var updatePlayerBarSong = function(){
    if (currentlyPlayingSongNumber) {
        $('.currently-playing .song-name').text(currentSongFromAlbum.title);
        $('.currently-playing .artist-name').text(currentAlbum.artist);
        $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
        $('.main-controls .play-pause').html(playerBarPauseButton);
        if (currentSoundFile.isPaused()){
            $('.main-controls .play-pause').html(playerBarPlayButton);
        } else {
            $('.main-controls .play-pause').html(playerBarPauseButton);
        }
    } else {
        $('.main-controls .play-pause').html(playerBarPlayButton);
    }
   
};
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next')

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
 });
