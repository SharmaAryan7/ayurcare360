import React from 'react';

export const FormGroup = ({ label, children }) => (
    <div className="mb-2 w-full">
        <label className="text-xs ml-2 font-black text-gray-500 uppercase tracking-widest mb-2 block">
            {label}
        </label>
        {children}
    </div>
);

export const Input = ({ type = "text", disabled, ...props }) => (
    <input
        type={type}
        disabled={disabled}
        className={`w-full text-xs bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-gray-900 font-bold focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59] focus:bg-white transition-all placeholder-gray-400 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        {...props}
    />
);

export const TextArea = ({ disabled, ...props }) => (
    <textarea
        disabled={disabled}
        className={`w-full bg-[#f9f2de] border text-sm border-gray-100 rounded-xl px-6 py-4 text-gray-900 font-medium focus:outline-none focus:border-[#4A7C59] focus:ring-1 focus:ring-[#4A7C59] focus:bg-white transition-all resize-none placeholder-gray-400 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
        rows="4"
        {...props}
    ></textarea>
);

export const SaveButton = ({ text, onClick, colorClass = "bg-[#4A7C59] hover:bg-[#3a6146]", textColor = "text-white" }) => (
    <button
        onClick={onClick}
        type="button"
        className={`mt-2 ${colorClass} ${textColor} px-8 py-3.5 rounded-full font-bold transition-all shadow-md hover:shadow-lg text-xs flex items-center gap-2`}
    >
        {text}
    </button>
);

export const Toggle = ({ enabled, onChange, label, description, disabled }) => (
    <div className={`flex items-center justify-between py-2 border-b border-gray-100 last:border-0 ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}>
        <div>
            <p className="font-bold text-gray-900 text-sm">{label}</p>
            {description && <p className="text-xs text-gray-500 mt-1 font-medium">{description}</p>}
        </div>
        <button
            type="button"
            onClick={disabled ? undefined : onChange}
            disabled={disabled}
            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors ${enabled ? 'bg-[#4A7C59]' : 'bg-gray-200'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'}`} />
        </button>
    </div>
);

export const CardHeader = ({ icon: Icon, title, description, iconColor = "text-[#4A7C59]", titleColor = "text-gray-900" }) => (
    <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
            <div className={`w-10 h-10 rounded-xl ${iconColor} flex items-center justify-center`}>
                <Icon size={16} />
            </div>
            <h2 className={`text-xl font-extrabold ${titleColor}`}>{title}</h2>
        </div>
        {description && <p className="text-sm text-gray-500 font-medium">{description}</p>}
    </div>
);