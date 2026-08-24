import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import "./styles/toolbar.css";

export  function Toolbar({className,style,editor} ){

    return(
         <div className={className} style={style}>

    <button
        className="editor-buttons"
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
    >
        <FormatBoldIcon/>
    </button>

    <button
        className="editor-buttons"
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
    >
        <FormatItalicIcon/>
    </button>

    <button
        className="editor-buttons"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()
        }
    >
        H1
    </button>

    <button
        className="editor-buttons"
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()
        }
    >
        H2
    </button>

    <button
        className="editor-buttons"
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()
        }
    >
        <FormatListBulletedIcon/>
    </button>

    <button
        className="editor-buttons"
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()
        }
    >
        <FormatListNumberedIcon/>
    </button>

</div>
    )

}