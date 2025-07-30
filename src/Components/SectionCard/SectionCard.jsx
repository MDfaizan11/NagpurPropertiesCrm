// import { useState } from "react";
// import {
//   MoreHorizontal,
//   ExternalLink,
//   Star,
//   Edit,
//   Copy,
//   Archive,
//   Trash2,
//   Eye,
// } from "lucide-react";
// import "../SectionCard/sectioncard.css";

// export default function SectionCard({ name, icon, color, count, viewMode }) {
//   const [isHovered, setIsHovered] = useState(false);
//   const [showMenu, setShowMenu] = useState(false);
//   const [isFavorite, setIsFavorite] = useState(false);

//   const toggleFavorite = (e) => {
//     e.stopPropagation();
//     setIsFavorite(!isFavorite);
//   };

//   if (viewMode === "list") {
//     return (
//       <div
//         className={`section-list-item ${color} ${isHovered ? "hovered" : ""}`}
//         onMouseEnter={() => setIsHovered(true)}
//         onMouseLeave={() => {
//           setIsHovered(false);
//           setShowMenu(false);
//         }}
//       >
//         <div className="list-item-icon-container">
//           <div className="list-item-icon">{icon}</div>
//         </div>
//         <div className="list-item-name">{name}</div>
//         <div className="list-item-count">
//           <span>{count}</span> active items
//         </div>
//         <div className="list-item-actions">
//           <button className="list-action-button">
//             <Eye size={16} />
//             <span>View</span>
//           </button>
//           <button className="list-action-button">
//             <Edit size={16} />
//             <span>Edit</span>
//           </button>
//           <button
//             className={`list-favorite-button ${isFavorite ? "active" : ""}`}
//             onClick={toggleFavorite}
//           >
//             <Star size={16} />
//           </button>
//           <div className="list-menu">
//             <button
//               className="list-menu-button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowMenu(!showMenu);
//               }}
//             >
//               <MoreHorizontal size={18} />
//             </button>
//             {showMenu && (
//               <div className="card-dropdown-menu">
//                 <button className="card-dropdown-item">
//                   <Edit size={14} />
//                   <span>Edit</span>
//                 </button>
//                 <button className="card-dropdown-item">
//                   <Copy size={14} />
//                   <span>Duplicate</span>
//                 </button>
//                 <button className="card-dropdown-item">
//                   <Archive size={14} />
//                   <span>Archive</span>
//                 </button>
//                 <button className="card-dropdown-item danger">
//                   <Trash2 size={14} />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div
//       className={`section-card ${color} ${isHovered ? "hovered" : ""}`}
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => {
//         setIsHovered(false);
//         setShowMenu(false);
//       }}
//     >
//       <div className="card-content">
//         <div className="card-header">
//           <div className="card-icon-container">
//             <div className="card-icon">{icon}</div>
//           </div>
//           <div className="card-menu">
//             <button
//               className={`card-favorite-button ${isFavorite ? "active" : ""}`}
//               onClick={toggleFavorite}
//             >
//               <Star size={16} />
//             </button>
//             <button
//               className="card-menu-button"
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setShowMenu(!showMenu);
//               }}
//             >
//               <MoreHorizontal size={18} />
//             </button>
//             {showMenu && (
//               <div className="card-dropdown-menu">
//                 <button className="card-dropdown-item">
//                   <Edit size={14} />
//                   <span>Edit</span>
//                 </button>
//                 <button className="card-dropdown-item">
//                   <Copy size={14} />
//                   <span>Duplicate</span>
//                 </button>
//                 <button className="card-dropdown-item">
//                   <Archive size={14} />
//                   <span>Archive</span>
//                 </button>
//                 <button className="card-dropdown-item danger">
//                   <Trash2 size={14} />
//                   <span>Delete</span>
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//         <div className="card-info">
//           <h3 className="card-title">{name}</h3>
//           <div className="card-stats">
//             <span className="card-count">{count}</span>
//             <span className="card-label">active items</span>
//           </div>
//         </div>
//         <div className="card-actions">
//           <button className="card-action-button primary">
//             <span>Manage</span>
//           </button>
//           <button className="card-action-button secondary">
//             <ExternalLink size={16} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreHorizontal,
  ExternalLink,
  Star,
  Edit,
  Copy,
  Archive,
  Trash2,
  Eye,
} from "lucide-react";
import "../SectionCard/sectioncard.css";

export default function SectionCard({
  name,
  icon,
  color,
  count,
  viewMode,
  path,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const navigate = useNavigate();

  const toggleFavorite = (e) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleManageClick = () => {
    if (path) {
      navigate(path);
    } else {
      console.warn(`No path defined for ${name}`);
    }
  };

  if (viewMode === "list") {
    return (
      <div
        className={`section-list-item ${color} ${isHovered ? "hovered" : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          setShowMenu(false);
        }}
      >
        <div className="list-item-icon-container">
          <div className="list-item-icon">{icon}</div>
        </div>
        <div className="list-item-name">{name}</div>
        <div className="list-item-count">
          <span>{count}</span> active items
        </div>
        <div className="list-item-actions">
          <button className="list-action-button">
            <Eye size={16} />
            <span>View</span>
          </button>
          <button className="list-action-button">
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            className={`list-favorite-button ${isFavorite ? "active" : ""}`}
            onClick={toggleFavorite}
          >
            <Star size={16} />
          </button>
          <div className="list-menu">
            <button
              className="list-menu-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div className="card-dropdown-menu">
                <button className="card-dropdown-item">
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button className="card-dropdown-item">
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button className="card-dropdown-item">
                  <Archive size={14} />
                  <span>Archive</span>
                </button>
                <button className="card-dropdown-item danger">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`section-card ${color} ${isHovered ? "hovered" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowMenu(false);
      }}
    >
      <div className="card-content">
        <div className="card-header">
          <div className="card-icon-container">
            <div className="card-icon">{icon}</div>
          </div>
          <div className="card-menu">
            <button
              className={`card-favorite-button ${isFavorite ? "active" : ""}`}
              onClick={toggleFavorite}
            >
              <Star size={16} />
            </button>
            <button
              className="card-menu-button"
              onClick={(e) => {
                e.stopPropagation();
                setShowMenu(!showMenu);
              }}
            >
              <MoreHorizontal size={18} />
            </button>
            {showMenu && (
              <div className="card-dropdown-menu">
                <button className="card-dropdown-item">
                  <Edit size={14} />
                  <span>Edit</span>
                </button>
                <button className="card-dropdown-item">
                  <Copy size={14} />
                  <span>Duplicate</span>
                </button>
                <button className="card-dropdown-item">
                  <Archive size={14} />
                  <span>Archive</span>
                </button>
                <button className="card-dropdown-item danger">
                  <Trash2 size={14} />
                  <span>Delete</span>
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="card-info">
          <h3 className="card-title">{name}</h3>
          <div className="card-stats">
            <span className="card-count">{count}</span>
            <span className="card-label">active items</span>
          </div>
        </div>
        <div className="card-actions">
          <button
            className="card-action-button primary"
            onClick={handleManageClick}
          >
            <span>Manage</span>
          </button>
          {/* <button className="card-action-button secondary">
            <ExternalLink size={16} />
          </button> */}
        </div>
      </div>
    </div>
  );
}
